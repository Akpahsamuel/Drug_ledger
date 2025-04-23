module drugledger::regulator {
    //use sui::object::{Self, UID};
    use sui::event;
  //  use sui::table::{Self, Table};
    //use sui::transfer;
    use sui::clock::{Self, Clock};
    //use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
   // use std::vector;
   // use sui::vec_map::{Self as vec_map};
    use drugledger::drug_ledger::{Self, DrugLedgerAdmin, RoleRegistry, Drug, StatusIndex};

    // Error codes
    const ENotAuthorized: u64 = 1;
    const EInvalidInput: u64 = 2;
    const EAddressAlreadyExists: u64 = 3;
    const ENotRegulator: u64 = 4;
    const EInvalidDrugStatus: u64 = 5;

    // Role constants (duplicated here for access)
    const ROLE_REGULATOR: u8 = 2;
    
    // Drug status constants
    const DRUG_STATUS_DRAFT: u8 = 0;
    const DRUG_STATUS_ACTIVE: u8 = 1;
    const DRUG_STATUS_RECALLED: u8 = 2;
  //  const DRUG_STATUS_EXPIRED: u8 = 3;

    // Type of regulatory oversight
    const OVERSIGHT_MINIMAL: u8 = 1;
   // const OVERSIGHT_STANDARD: u8 = 2;
    const OVERSIGHT_ENHANCED: u8 = 3;

    // Regulator object
    public struct Regulator has key, store {
        id: UID,
        name: String,
        jurisdiction: String,
        address: address,
    }

    // Oversight requirements for a drug
    public struct OversightRequirement has key, store {
        id: UID,
        drug_id: u64,
        oversight_level: u8,
        verification_frequency: u64,  // in days
        last_verified: u64,
        notes: String,
        set_by: address,
    }

    // Event for registering a regulator
    public struct RegisteredRegulator has copy, drop {
        name: String,
        jurisdiction: String,
        address: address,
    }
    
    // Event for approving a drug
    public struct DrugApproved has copy, drop {
        drug_id: u64,
        approved_by: address,
        regulator_name: String,
        timestamp: u64,
        notes: String,
    }
    
    // Event for recalling a drug
    public struct DrugRecalled has copy, drop {
        drug_id: u64,
        recalled_by: address,
        regulator_name: String,
        timestamp: u64,
        reason: String,
        severity: u8,
    }
    
    // Event for regulator report
    public struct RegulatorReport has copy, drop {
        drug_id: u64,
        report_id: u64,
        reported_by: address,
        regulator_name: String,
        report_type: String,
        content: String,
        timestamp: u64,
    }

    // Event for setting oversight requirements
    public struct OversightRequirementSet has copy, drop {
        drug_id: u64,
        oversight_level: u8,
        verification_frequency: u64,
        set_by: address,
        regulator_name: String,
        timestamp: u64,
    }

    /// Registers a new regulator and assigns the ROLE_REGULATOR role.
    /// Only admin can register regulators.
    /// 
    /// # Arguments
    /// * `admin` - The admin object
    /// * `role_registry` - The role registry
    /// * `addr` - The address of the regulator
    /// * `name` - The name of the regulator
    /// * `jurisdiction` - The jurisdiction of the regulator
    /// * `clock` - The clock object for timestamp
    public entry fun register_regulator(
        admin: &DrugLedgerAdmin,
        role_registry: &mut RoleRegistry,
        addr: address,
        name: vector<u8>,
        jurisdiction: vector<u8>,
        //clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Check that sender is admin using the is_admin function
        let sender = tx_context::sender(ctx);
        assert!(drug_ledger::is_admin(role_registry, sender), ENotAuthorized);
        
        assert!(vector::length(&jurisdiction) > 0, EInvalidInput);
        
        // Check if address already has the regulator role
        assert!(!drug_ledger::has_role(role_registry, addr, ROLE_REGULATOR), EAddressAlreadyExists);
        
        let name_str = string::utf8(name);
        let jurisdiction_str = string::utf8(jurisdiction);
        
        let regulator = Regulator {
            id: object::new(ctx),
            name: name_str,
            jurisdiction: jurisdiction_str,
            address: addr,
        };  
        
        // Assign regulator role
        drug_ledger::assign_role(admin, role_registry, addr, ROLE_REGULATOR, ctx);
        
        // Transfer regulator object to the address
        transfer::transfer(regulator, addr);
        
        event::emit(RegisteredRegulator {
            name: name_str,
            jurisdiction: jurisdiction_str,
            address: addr,
        });
    }

    /// Approves a drug by changing its status from DRAFT to ACTIVE.
    /// Only regulators can approve drugs.
    /// 
    /// # Arguments
    /// * `regulator` - The regulator object
    /// * `drug` - The drug to approve
    /// * `status_index` - The status index
    /// * `notes` - Any approval notes
    /// * `role_registry` - The role registry
    /// * `clock` - The clock object for timestamp
    public entry fun approve_drug(
        regulator: &Regulator,
        drug: &mut Drug,
        status_index: &mut StatusIndex,
        notes: vector<u8>,
        role_registry: &RoleRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify sender is the regulator
        let sender = tx_context::sender(ctx);
        assert!(sender == regulator.address, ENotAuthorized);
        assert!(drug_ledger::is_regulator(role_registry, sender), ENotRegulator);
        
        // Drug must be in DRAFT status
        assert!(drug_ledger::get_drug_status(drug) == DRUG_STATUS_DRAFT, EInvalidDrugStatus);
        
        // Update the drug status to ACTIVE
        drug_ledger::update_drug_status_internal(drug, status_index, DRUG_STATUS_ACTIVE, clock::timestamp_ms(clock));
        
        // Emit approval event
        event::emit(DrugApproved {
            drug_id: drug_ledger::get_drug_id(drug),
            approved_by: sender,
            regulator_name: regulator.name,
            timestamp: clock::timestamp_ms(clock),
            notes: string::utf8(notes),
        });
    }

    /// Recalls a drug by changing its status from ACTIVE to RECALLED.
    /// Only regulators can recall drugs.
    /// 
    /// # Arguments
    /// * `regulator` - The regulator object
    /// * `drug` - The drug to recall
    /// * `status_index` - The status index
    /// * `reason` - The reason for recall
    /// * `severity` - The severity level (1-5)
    /// * `role_registry` - The role registry
    /// * `clock` - The clock object for timestamp
    public entry fun recall_drug(
        regulator: &Regulator,
        drug: &mut Drug,
        status_index: &mut StatusIndex,
        reason: vector<u8>,
        severity: u8,
        role_registry: &RoleRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify sender is the regulator
        let sender = tx_context::sender(ctx);
        assert!(sender == regulator.address, ENotAuthorized);
        assert!(drug_ledger::is_regulator(role_registry, sender), ENotRegulator);
        
        // Drug must be in ACTIVE status
        assert!(drug_ledger::get_drug_status(drug) == DRUG_STATUS_ACTIVE, EInvalidDrugStatus);
        
        // Validate severity level
        assert!(severity >= 1 && severity <= 5, EInvalidInput);
        
        // Update the drug status to RECALLED
        drug_ledger::update_drug_status_internal(drug, status_index, DRUG_STATUS_RECALLED, clock::timestamp_ms(clock));
        
        // Emit recall event
        event::emit(DrugRecalled {
            drug_id: drug_ledger::get_drug_id(drug),
            recalled_by: sender,
            regulator_name: regulator.name,
            timestamp: clock::timestamp_ms(clock),
            reason: string::utf8(reason),
            severity,
        });
    }

    /// Files a regulator report about a drug.
    /// Only regulators can file reports.
    /// 
    /// # Arguments
    /// * `regulator` - The regulator object
    /// * `drug` - The drug the report is about
    /// * `report_type` - The type of report
    /// * `content` - The content of the report
    /// * `role_registry` - The role registry
    /// * `clock` - The clock object for timestamp
    public entry fun file_report(
        regulator: &Regulator,
        drug: &Drug,
        report_type: vector<u8>,
        content: vector<u8>,
        role_registry: &RoleRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify sender is the regulator
        let sender = tx_context::sender(ctx);
        assert!(sender == regulator.address, ENotAuthorized);
        assert!(drug_ledger::is_regulator(role_registry, sender), ENotRegulator);
        
        // Simple report ID generation - in a real system, we would track these
        let report_id = clock::timestamp_ms(clock) % 1000000;
        
        // Emit report event
        event::emit(RegulatorReport {
            drug_id: drug_ledger::get_drug_id(drug),
            report_id,
            reported_by: sender,
            regulator_name: regulator.name,
            report_type: string::utf8(report_type),
            content: string::utf8(content),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Sets oversight requirements for a drug.
    /// Only regulators can set oversight requirements.
    /// 
    /// # Arguments
    /// * `regulator` - The regulator object
    /// * `drug` - The drug to set oversight for
    /// * `oversight_level` - The level of oversight (1-3)
    /// * `verification_frequency` - How often verification is required (in days)
    /// * `notes` - Notes about the oversight requirements
    /// * `role_registry` - The role registry
    /// * `clock` - The clock object for timestamp
    public entry fun set_oversight_requirements(
        regulator: &Regulator,
        drug: &Drug,
        oversight_level: u8,
        verification_frequency: u64,
        notes: vector<u8>,
        role_registry: &RoleRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify sender is the regulator
        let sender = tx_context::sender(ctx);
        assert!(sender == regulator.address, ENotAuthorized);
        assert!(drug_ledger::is_regulator(role_registry, sender), ENotRegulator);
        
        // Validate input
        assert!(oversight_level >= OVERSIGHT_MINIMAL && oversight_level <= OVERSIGHT_ENHANCED, EInvalidInput);
        assert!(verification_frequency > 0, EInvalidInput);
        
        let drug_id = drug_ledger::get_drug_id(drug);
        let timestamp = clock::timestamp_ms(clock);
        
        // Create oversight requirement object
        let requirement = OversightRequirement {
            id: object::new(ctx),
            drug_id,
            oversight_level,
            verification_frequency,
            last_verified: timestamp,
            notes: string::utf8(notes),
            set_by: sender,
        };
        
        // Make it a shared object so all regulators can see it
        transfer::share_object(requirement);
        
        // Emit oversight requirement event
        event::emit(OversightRequirementSet {
            drug_id,
            oversight_level,
            verification_frequency,
            set_by: sender,
            regulator_name: regulator.name,
            timestamp,
        });
    }

    /// Gets a summary of drugs requiring regulatory attention.
    /// Only regulators can call this function.
    /// Returns a vector of drug IDs ordered by priority.
    /// 
    /// # Arguments
    /// * `regulator` - The regulator object
    /// * `role_registry` - The role registry
    /// * `status_index` - The status index for accessing drug statuses
    /// * `max_count` - Maximum number of drugs to return
    /// * `include_draft` - Whether to include drugs in DRAFT status that need approval
    /// * `include_active` - Whether to include drugs in ACTIVE status that need monitoring
    /// * `include_recalled` - Whether to include drugs in RECALLED status that need follow-up
    /// 
    /// # Returns
    /// * A vector of drug IDs requiring attention
    public fun get_regulatory_dashboard(
        regulator: &Regulator,
        role_registry: &RoleRegistry,
        status_index: &StatusIndex,
        max_count: u64,
        include_draft: bool,
        include_active: bool,
        include_recalled: bool,
        ctx: &TxContext
    ): vector<u64> {
        // Verify sender is the regulator
        let sender = tx_context::sender(ctx);
        assert!(sender == regulator.address, ENotAuthorized);
        assert!(drug_ledger::is_regulator(role_registry, sender), ENotRegulator);
        
        // Use the helper function from drug_ledger module to get prioritized drugs
        drug_ledger::get_regulatory_priority_drugs(
            status_index, 
            max_count, 
            include_draft, 
            include_active, 
            include_recalled
        )
    }

    /// Gets regulator information.
    /// 
    /// # Arguments
    /// * `regulator` - The regulator object
    /// 
    /// # Returns
    /// * The regulator information
    public fun get_regulator_info(regulator: &Regulator): (String, String, address) {
        (
            regulator.name,
            regulator.jurisdiction,
            regulator.address
        )
    }
} 