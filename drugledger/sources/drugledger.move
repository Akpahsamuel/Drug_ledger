module drugledger::drug_ledger {
   // use sui::object::{Self, UID};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::dynamic_field as df;
    use std::string::{Self, String};
   // use std::vector;
    use sui::clock::{Self, Clock};
    use sui::vec_map::{Self, VecMap};
  //  use sui::transfer;
   // use sui::tx_context::{Self, TxContext};

    // Error codes
    const ENotIssueOwner: u64 = 3;
    const EInvalidInput: u64 = 4;
    const ENotAuthorized: u64 = 5;
    const EIssueNotFound: u64 = 6;
    const EInvalidCID: u64 = 7;
    const EInvalidLicense: u64 = 8;

    // Role constants
    const ROLE_ADMIN: u8 = 0;
    const ROLE_MANUFACTURER: u8 = 1;
    const ROLE_REGULATOR: u8 = 2;
    const ROLE_DISTRIBUTOR: u8 = 3;

    // Pagination constants
    const DEFAULT_PAGE_SIZE: u64 = 20;
    const MAX_PAGE_SIZE: u64 = 100;

    // CID validation
    const MIN_CID_LENGTH: u64 = 46; // Minimum length for valid IPFS CID

    // Capability for upgrades
    public struct UpgradeCapability has key, store {
        id: UID,
        version: u64,
    }

    // Main Admin object
    public struct DrugLedgerAdmin has key {
        id: UID,
        version: u64,
        owner: address,
    }

    // Role manager
    public struct RoleRegistry has key {
        id: UID,
        roles: Table<address, u8>,
    }

    // Manufacturer object
    public struct Manufacturer has key, store {
        id: UID,
        name: String,
        license: String,
        address: address,
        verified: bool,
        registration_date: u64,
        drug_count: u64,
    }

    // Regulator object
    #[allow(unused_field)]
    public struct Regulator has key, store {
        id: UID,
        name: String,
        jurisdiction: String,
        address: address,
    }

    // Issue with pagination support
    public struct Issue has store, copy, drop {
        name: String,
        description: String,
        date: u64,
        owner: address,
        resolved: bool,
        reason: String,
        severity: u8, // 1-5 scale
        category: String,
    }

    // Issues collection as a dynamic field
    public struct IssueCollection has store {
        issues: vector<Issue>,
        open_count: u64,
        resolved_count: u64,
    }

    // Drug with metadata and indexing
    public struct Drug has key, store {
        id: UID,
        drug_id: u64,
        cid: String,
        manufacturer: address,
        creation_date: u64,
        last_updated: u64,
        status: u8, // 0=draft, 1=active, 2=recalled, 3=expired
        verified: bool,
    }

    // Counter for drug IDs
    public struct DrugCounter has key {
        id: UID,
        counter: u64,
    }

    // Index for drugs by manufacturer
    public struct ManufacturerIndex has key {
        id: UID,
        manufacturers: Table<address, vector<u64>>, // address -> list of drug IDs
    }

    // Drug status index
    public struct StatusIndex has key {
        id: UID,
        by_status: VecMap<u8, vector<u64>>, // status -> list of drug IDs
    }

    // Events
    public struct IssueOpened has copy, drop {
        drug_id: u64,
        issue_id: u64,
        name: String,
        description: String,
        severity: u8,
        category: String,
    }

    public struct IssueClosed has copy, drop {
        drug_id: u64,
        issue_id: u64,
        reason: String,
        resolution_time_ms: u64,
    }

    public struct RegisteredManufacturer has copy, drop {
        name: String,
        license: String,
        address: address,
    }

    public struct RegisteredDrug has copy, drop {
        drug_id: u64,
        manufacturer: String,
        cid: String,
    }

    public struct ManufacturerRevoked has copy, drop {
        name: String,
        license: String,
        address: address,
        reason: String,
    }

    public struct DrugStatusChanged has copy, drop {
        drug_id: u64,
        old_status: u8,
        new_status: u8,
        changed_by: address,
    }

    public struct Log has copy, drop {
        drug_id: u64,
        entity: String,
        action: String,
        from: address,
        timestamp: u64,
    }

    public struct UpgradePerformed has copy, drop {
        old_version: u64,
        new_version: u64,
        performed_by: address,
    }

    /// Initialization function - creates the core system objects 
    /// and assigns admin rights to the deployer
    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        // Create admin capability with owner
        let admin = DrugLedgerAdmin {
            id: object::new(ctx),
            version: 1,
            owner: sender,
        };
        
        // Create upgrade capability
        let upgrade_cap = UpgradeCapability {
            id: object::new(ctx),
            version: 1,
        };
        
        // Create role registry with mut keyword
        let mut role_registry = RoleRegistry {
            id: object::new(ctx),
            roles: table::new(ctx),
        };
        
        // Set the deployer as admin
        table::add(&mut role_registry.roles, sender, ROLE_ADMIN);
        
        // Create drug counter
        let counter = DrugCounter {
            id: object::new(ctx),
            counter: 0,
        };
        
        // Create indices
        let manufacturer_index = ManufacturerIndex {
            id: object::new(ctx),
            manufacturers: table::new(ctx),
        };
        
        let status_index = StatusIndex {
            id: object::new(ctx),
            by_status: vec_map::empty(),
        };
        
        // Transfer objects to appropriate owners
        transfer::transfer(admin, sender);
        transfer::transfer(upgrade_cap, sender);
        transfer::share_object(role_registry);
        transfer::share_object(counter);
        transfer::share_object(manufacturer_index);
        transfer::share_object(status_index);
    }

    // ======== Role Management ========

    /// Assigns a role to an address. Only the admin can assign roles.
    /// If the address already has a role, it will be updated.
    /// 
    /// # Arguments
    /// * `admin` - The admin object
    /// * `role_registry` - The role registry
    /// * `addr` - The address to assign the role to
    /// * `role` - The role to assign (must be <= ROLE_DISTRIBUTOR)
    public entry fun assign_role(
        admin: &DrugLedgerAdmin,
        role_registry: &mut RoleRegistry,
        addr: address,
        role: u8,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == get_owner_address(admin), ENotAuthorized);
        assert!(role <= ROLE_DISTRIBUTOR, EInvalidInput);
        
        if (table::contains(&role_registry.roles, addr)) {
            let _current_role = table::remove(&mut role_registry.roles, addr);
            table::add(&mut role_registry.roles, addr, role);
        } else {
            table::add(&mut role_registry.roles, addr, role);
        };
    }

    /// Gets the role of an address. Returns 255 if the address has no role.
    /// 
    /// # Arguments
    /// * `role_registry` - The role registry
    /// * `addr` - The address to get the role for
    /// 
    /// # Returns
    /// * The role of the address, or 255 if no role is assigned
    public fun get_role(role_registry: &RoleRegistry, addr: address): u8 {
        if (table::contains(&role_registry.roles, addr)) {
            *table::borrow(&role_registry.roles, addr)
        } else {
            255 // No role
        }
    }

    // ======== Manufacturer Management ========

    /// Registers a new manufacturer and assigns the ROLE_MANUFACTURER role.
    /// Only admin can register manufacturers.
    /// 
    /// # Arguments
    /// * `admin` - The admin object
    /// * `role_registry` - The role registry
    /// * `addr` - The address of the manufacturer
    /// * `name` - The name of the manufacturer
    /// * `license` - The license number/ID of the manufacturer
    /// * `clock` - The clock object for timestamp
    public entry fun register_manufacturer(
        admin: &DrugLedgerAdmin,
        role_registry: &mut RoleRegistry,
        addr: address,
        name: vector<u8>,
        license: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == get_owner_address(admin), ENotAuthorized);
        assert!(vector::length(&license) > 0, EInvalidLicense);
        
        let name_str = string::utf8(name);
        let license_str = string::utf8(license);
        
        let manufacturer = Manufacturer {
            id: object::new(ctx),
            name: name_str,
            license: license_str,
            address: addr,
            verified: true,
            registration_date: clock::timestamp_ms(clock),
            drug_count: 0,
        };
        
        // Assign manufacturer role
        assign_role(admin, role_registry, addr, ROLE_MANUFACTURER, ctx);
        
        // Transfer manufacturer object to the address
        transfer::transfer(manufacturer, addr);
        
        event::emit(RegisteredManufacturer {
            name: name_str,
            license: license_str,
            address: addr,
        });
    }

    /// Revokes a manufacturer's registration and role.
    /// Only admin can revoke manufacturers.
    /// 
    /// # Arguments
    /// * `admin` - The admin object
    /// * `role_registry` - The role registry
    /// * `manufacturer` - The manufacturer object to revoke
    /// * `reason` - The reason for revocation
    public entry fun revoke_manufacturer(
        admin: &DrugLedgerAdmin,
        role_registry: &mut RoleRegistry,
        manufacturer: Manufacturer,
        reason: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == get_owner_address(admin), ENotAuthorized);
        
        let Manufacturer { id, name, license, address, verified: _, registration_date: _, drug_count: _ } = manufacturer;
        
        // Remove role
        if (table::contains(&role_registry.roles, address)) {
            let _ = table::remove(&mut role_registry.roles, address);
        };
        
        event::emit(ManufacturerRevoked {
            name: name,
            license: license,
            address: address,
            reason: string::utf8(reason),
        });
        
        object::delete(id);
    }

    // ======== Drug Management ========

    /// Registers a new drug and creates necessary indexing.
    /// Only manufacturers can register drugs.
    /// 
    /// # Arguments
    /// * `manufacturer` - The manufacturer object
    /// * `counter` - The drug counter for generating IDs
    /// * `manufacturer_index` - The manufacturer index
    /// * `status_index` - The status index
    /// * `cid` - The IPFS Content ID storing drug metadata
    /// * `clock` - The clock object for timestamp
    public entry fun register_drug(
        manufacturer: &Manufacturer,
        counter: &mut DrugCounter,
        manufacturer_index: &mut ManufacturerIndex,
        status_index: &mut StatusIndex,
        cid: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(manufacturer.address == tx_context::sender(ctx), ENotAuthorized);
        assert!(vector::length(&cid) >= MIN_CID_LENGTH, EInvalidCID);
        
        let drug_id = counter.counter;
        counter.counter = counter.counter + 1;
        
        let cid_str = string::utf8(cid);
        let timestamp = clock::timestamp_ms(clock);
        
        // Add mut keyword here
        let mut drug = Drug {
            id: object::new(ctx),
            drug_id,
            cid: cid_str,
            manufacturer: tx_context::sender(ctx),
            creation_date: timestamp,
            last_updated: timestamp,
            status: 0, // Draft status
            verified: false,
        };
        
        // Create empty issue collection
        let issues = IssueCollection {
            issues: vector::empty(),
            open_count: 0,
            resolved_count: 0,
        };
        
        // Add issues as a dynamic field
        df::add(&mut drug.id, b"issues", issues);
        
        // Update manufacturer index
        if (!table::contains(&manufacturer_index.manufacturers, tx_context::sender(ctx))) {
            table::add(&mut manufacturer_index.manufacturers, tx_context::sender(ctx), vector::empty<u64>());
        };
        
        let mfg_drugs = table::borrow_mut(&mut manufacturer_index.manufacturers, tx_context::sender(ctx));
        vector::push_back(mfg_drugs, drug_id);
        
        // Update status index
        if (!vec_map::contains(&status_index.by_status, &0)) {
            vec_map::insert(&mut status_index.by_status, 0, vector::empty<u64>());
        };
        
        let status_drugs = vec_map::get_mut(&mut status_index.by_status, &0);
        vector::push_back(status_drugs, drug_id);
        
        // Share drug object
        transfer::share_object(drug);
        
        event::emit(RegisteredDrug {
            drug_id,
            manufacturer: manufacturer.name,
            cid: cid_str,
        });
    }

    /// Updates the status of a drug and updates indexing.
    /// Only the drug manufacturer, regulators, or admin can update status.
    /// 
    /// # Arguments
    /// * `drug` - The drug object
    /// * `status_index` - The status index
    /// * `new_status` - The new status (0-3)
    /// * `role_registry` - The role registry
    /// * `clock` - The clock object for timestamp
    public entry fun update_drug_status(
        drug: &mut Drug,
        status_index: &mut StatusIndex,
        new_status: u8,
        role_registry: &RoleRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let role = get_role(role_registry, sender);
        
        // Only manufacturer or regulator can update status
        assert!(
            (role == ROLE_MANUFACTURER && drug.manufacturer == sender) || 
            role == ROLE_REGULATOR || 
            role == ROLE_ADMIN, 
            ENotAuthorized
        );
        
        // Status must be valid (0-3)
        assert!(new_status <= 3, EInvalidInput);
        
        let old_status = drug.status;
        
        // Remove from old status index
        if (vec_map::contains(&status_index.by_status, &old_status)) {
            let status_drugs = vec_map::get_mut(&mut status_index.by_status, &old_status);
            let (contains, idx) = vector::index_of(status_drugs, &drug.drug_id);
            if (contains) {
                vector::remove(status_drugs, idx);
            };
        };
        
        // Add to new status index
        if (!vec_map::contains(&status_index.by_status, &new_status)) {
            vec_map::insert(&mut status_index.by_status, new_status, vector::empty<u64>());
        };
        
        let status_drugs = vec_map::get_mut(&mut status_index.by_status, &new_status);
        vector::push_back(status_drugs, drug.drug_id);
        
        // Update drug status
        drug.status = new_status;
        drug.last_updated = clock::timestamp_ms(clock);
        
        event::emit(DrugStatusChanged {
            drug_id: drug.drug_id,
            old_status,
            new_status,
            changed_by: sender,
        });
    }

    // ======== Issue Management with Pagination ========

    /// Opens a new issue for a drug.
    /// Anyone can open an issue.
    /// 
    /// # Arguments
    /// * `drug` - The drug object
    /// * `name` - The issue name
    /// * `description` - The issue description
    /// * `severity` - The severity level (1-5)
    /// * `category` - The issue category
    /// * `clock` - The clock object for timestamp
    public entry fun open_issue(
        drug: &mut Drug,
        name: vector<u8>,
        description: vector<u8>,
        severity: u8,
        category: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(severity >= 1 && severity <= 5, EInvalidInput);
        
        let issue = Issue {
            name: string::utf8(name),
            description: string::utf8(description),
            date: clock::timestamp_ms(clock),
            owner: tx_context::sender(ctx),
            resolved: false,
            reason: string::utf8(b""),
            severity,
            category: string::utf8(category),
        };
        
        // Get issues collection
        let issues: &mut IssueCollection = df::borrow_mut(&mut drug.id, b"issues");
        
        let issue_id = vector::length(&issues.issues);
        vector::push_back(&mut issues.issues, issue);
        issues.open_count = issues.open_count + 1;
        
        // Update drug verification status
        drug.verified = false;
        drug.last_updated = clock::timestamp_ms(clock);
        
        event::emit(IssueOpened {
            drug_id: drug.drug_id,
            issue_id,
            name: string::utf8(name),
            description: string::utf8(description),
            severity,
            category: string::utf8(category),
        });
    }

    /// Closes an issue for a drug.
    /// Only the issue owner or drug manufacturer can close an issue.
    /// 
    /// # Arguments
    /// * `drug` - The drug object
    /// * `issue_id` - The ID of the issue to close
    /// * `reason` - The resolution reason
    /// * `clock` - The clock object for timestamp
    public entry fun close_issue(
        drug: &mut Drug,
        issue_id: u64,
        reason: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let issues: &mut IssueCollection = df::borrow_mut(&mut drug.id, b"issues");
        
        // Check if issue exists
        assert!(issue_id < vector::length(&issues.issues), EIssueNotFound);
        
        let issue = vector::borrow_mut(&mut issues.issues, issue_id);
        
        // Check if sender is issue owner or drug manufacturer
        let sender = tx_context::sender(ctx);
        assert!(issue.owner == sender || drug.manufacturer == sender, ENotIssueOwner);
        
        // Update issue
        let current_time = clock::timestamp_ms(clock);
        let resolution_time = current_time - issue.date;
        
        issue.reason = string::utf8(reason);
        issue.resolved = true;
        
        // Update counters
        issues.open_count = issues.open_count - 1;
        issues.resolved_count = issues.resolved_count + 1;
        
        // Update drug
        drug.last_updated = current_time;
        
        // Check if all issues are resolved
        if (issues.open_count == 0) {
            drug.verified = true;
        };
        
        event::emit(IssueClosed {
            drug_id: drug.drug_id,
            issue_id,
            reason: string::utf8(reason),
            resolution_time_ms: resolution_time,
        });
    }

    // ======== Pagination Support ========

    /// Gets a page of issues for a drug.
    /// 
    /// # Arguments
    /// * `drug` - The drug object
    /// * `page` - The page number (0-based)
    /// * `page_size` - The page size (0 = default)
    /// 
    /// # Returns
    /// * A vector of issues for the specified page
    public fun get_issues_page(
        drug: &Drug,
        page: u64,
        page_size: u64
    ): vector<Issue> {
        let actual_page_size = if (page_size == 0 || page_size > MAX_PAGE_SIZE) {
            DEFAULT_PAGE_SIZE
        } else {
            page_size
        };
        
        let issues: &IssueCollection = df::borrow(&drug.id, b"issues");
        let total_issues = vector::length(&issues.issues);
        
        let start_idx = page * actual_page_size;
        if (start_idx >= total_issues) {
            return vector::empty()
        };
        
        let end_idx = if (start_idx + actual_page_size > total_issues) {
            total_issues
        } else {
            start_idx + actual_page_size
        };
        
        // Add mut keyword to result
        let mut result = vector::empty<Issue>();
        // Add mut keyword to i
        let mut i = start_idx;
        
        while (i < end_idx) {
            let issue = vector::borrow(&issues.issues, i);
            vector::push_back(&mut result, *issue);
            i = i + 1;
        };
        
        result
    }

    // ======== Logging ========

    /// Adds a log entry for a drug.
    /// Emits a Log event.
    /// 
    /// # Arguments
    /// * `drug_id` - The drug ID
    /// * `entity` - The entity performing the action
    /// * `action` - The action performed
    /// * `clock` - The clock object for timestamp
    public entry fun add_log(
        drug_id: u64,
        entity: vector<u8>,
        action: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        event::emit(Log {
            drug_id,
            entity: string::utf8(entity),
            action: string::utf8(action),
            from: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    // ======== Verification ========

    /// Checks if a drug is verified (all issues resolved).
    /// 
    /// # Arguments
    /// * `drug` - The drug object
    /// 
    /// # Returns
    /// * true if the drug is verified, false otherwise
    public fun verify(drug: &Drug): bool {
        let issues: &IssueCollection = df::borrow(&drug.id, b"issues");
        issues.open_count == 0
    }

    // ======== Query Functions ========

    /// Gets manufacturer information.
    /// 
    /// # Arguments
    /// * `manufacturer` - The manufacturer object
    /// 
    /// # Returns
    /// * The manufacturer information
    public fun get_manufacturer_info(manufacturer: &Manufacturer): (String, String, address, bool, u64, u64) {
        (
            manufacturer.name,
            manufacturer.license,
            manufacturer.address,
            manufacturer.verified,
            manufacturer.registration_date,
            manufacturer.drug_count
        )
    }

    /// Gets drug information.
    /// 
    /// # Arguments
    /// * `drug` - The drug object
    /// 
    /// # Returns
    /// * The drug information
    public fun get_drug_info(drug: &Drug): (u64, String, address, u64, u64, u8, bool) {
        (
            drug.drug_id,
            drug.cid,
            drug.manufacturer,
            drug.creation_date,
            drug.last_updated,
            drug.status,
            drug.verified
        )
    }

    /// Gets the number of open and resolved issues for a drug.
    /// 
    /// # Arguments
    /// * `drug` - The drug object
    /// 
    /// # Returns
    /// * The number of open and resolved issues
    public fun get_drug_issue_counts(drug: &Drug): (u64, u64) {
        let issues: &IssueCollection = df::borrow(&drug.id, b"issues");
        (issues.open_count, issues.resolved_count)
    }

    /// Gets all drug IDs for a manufacturer.
    /// 
    /// # Arguments
    /// * `manufacturer_index` - The manufacturer index
    /// * `manufacturer_addr` - The manufacturer address
    /// 
    /// # Returns
    /// * A vector of drug IDs
    public fun get_drugs_by_manufacturer(
        manufacturer_index: &ManufacturerIndex,
        manufacturer_addr: address
    ): vector<u64> {
        if (table::contains(&manufacturer_index.manufacturers, manufacturer_addr)) {
            *table::borrow(&manufacturer_index.manufacturers, manufacturer_addr)
        } else {
            vector::empty<u64>()
        }
    }

    /// Gets all drug IDs with a specific status.
    /// 
    /// # Arguments
    /// * `status_index` - The status index
    /// * `status` - The status to query
    /// 
    /// # Returns
    /// * A vector of drug IDs
    public fun get_drugs_by_status(
        status_index: &StatusIndex,
        status: u8
    ): vector<u64> {
        if (vec_map::contains(&status_index.by_status, &status)) {
            *vec_map::get(&status_index.by_status, &status)
        } else {
            vector::empty<u64>()
        }
    }

    // ======== Upgrade Support ========

    /// Upgrades the contract version.
    /// Only admin can perform upgrades.
    /// 
    /// # Arguments
    /// * `admin` - The admin object
    /// * `upgrade_cap` - The upgrade capability
    /// * `new_version` - The new version number
    public entry fun upgrade(
        admin: &mut DrugLedgerAdmin,
        upgrade_cap: &mut UpgradeCapability,
        new_version: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == get_owner_address(admin), ENotAuthorized);
        assert!(new_version > admin.version, EInvalidInput);
        assert!(new_version == upgrade_cap.version + 1, EInvalidInput);
        
        let old_version = admin.version;
        admin.version = new_version;
        upgrade_cap.version = new_version;
        
        event::emit(UpgradePerformed {
            old_version,
            new_version,
            performed_by: tx_context::sender(ctx),
        });
    }

    // ======== Helper Functions ========

    /// Gets the owner address of the admin object.
    /// 
    /// # Arguments
    /// * `admin` - The admin object
    /// 
    /// # Returns
    /// * The owner address
    fun get_owner_address(admin: &DrugLedgerAdmin): address {
        admin.owner
    }
}