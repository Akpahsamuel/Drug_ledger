
#[allow(unused_const)]

module drugledger::distributor {
   // use sui::object::{Self, UID};
    use sui::event;
// use sui::table::{Self, Table};
   // use sui::transfer;
    use sui::clock::{Self, Clock};
    //use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    //use std::vector;
   // use sui::vec_map::{Self as vec_map};
    use drugledger::drug_ledger::{Self, DrugLedgerAdmin, RoleRegistry, Drug};

    // Error codes
    const ENotAuthorized: u64 = 1;
    const EInvalidInput: u64 = 2;
    const EAddressAlreadyExists: u64 = 3;
    const ENotDistributor: u64 = 4;
    const EInvalidDrugStatus: u64 = 5;
    const EShipmentNotFound: u64 = 6;
    const EInvalidQuantity: u64 = 7;

    // Role constants (duplicated here for access)
    const ROLE_DISTRIBUTOR: u8 = 3;
    
    // Shipment status constants
    const SHIPMENT_STATUS_PENDING: u8 = 0;
    const SHIPMENT_STATUS_IN_TRANSIT: u8 = 1;
    const SHIPMENT_STATUS_DELIVERED: u8 = 2;
    const SHIPMENT_STATUS_REJECTED: u8 = 3;

    // Distributor object
    public struct Distributor has key, store {
        id: UID,
        name: String,
        license: String,
        address: address,
        registration_date: u64,
    }

    // Shipment object to track drug distribution
    public struct Shipment has key, store {
        id: UID,
        shipment_id: u64,
        drug_id: u64,
        origin: address,
        destination: address,
        quantity: u64,
        status: u8,
        creation_date: u64,
        last_updated: u64,
        tracking_number: String,
        notes: String,
    }

    // Counter for shipment IDs
    public struct ShipmentCounter has key {
        id: UID,
        counter: u64,
    }

    // Events
    public struct RegisteredDistributor has copy, drop {
        name: String,
        license: String,
        address: address,
    }
    
    public struct CreatedShipment has copy, drop {
        shipment_id: u64,
        drug_id: u64,
        origin: address,
        destination: address,
        quantity: u64,
        distributor: address,
        timestamp: u64,
    }
    
    public struct UpdatedShipmentStatus has copy, drop {
        shipment_id: u64,
        old_status: u8,
        new_status: u8,
        updated_by: address,
        timestamp: u64,
        notes: String,
    }
    
    public struct DistributionRecord has copy, drop {
        shipment_id: u64,
        drug_id: u64,
        distributor_name: String,
        destination: address,
        quantity: u64,
        timestamp: u64,
    }

    /// Initialization function - creates the shipment counter
    fun init(ctx: &mut TxContext) {
        let counter = ShipmentCounter {
            id: object::new(ctx),
            counter: 0,
        };
        
        transfer::share_object(counter);
    }

    /// Registers a new distributor and assigns the ROLE_DISTRIBUTOR role.
    /// Only admin can register distributors.
    /// 
    /// # Arguments
    /// * `admin` - The admin object
    /// * `role_registry` - The role registry
    /// * `addr` - The address of the distributor
    /// * `name` - The name of the distributor
    /// * `license` - The license number/ID of the distributor
    /// * `clock` - The clock object for timestamp
    public entry fun register_distributor(
        admin: &DrugLedgerAdmin,
        role_registry: &mut RoleRegistry,
        addr: address,
        name: vector<u8>,
        license: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Check that sender is admin
        let sender = tx_context::sender(ctx);
        assert!(drug_ledger::is_admin(role_registry, sender), ENotAuthorized);
        
        assert!(vector::length(&license) > 0, EInvalidInput);
        
        // Check if address already has the distributor role
        assert!(!drug_ledger::has_role(role_registry, addr, ROLE_DISTRIBUTOR), EAddressAlreadyExists);
        
        let name_str = string::utf8(name);
        let license_str = string::utf8(license);
        
        let distributor = Distributor {
            id: object::new(ctx),
            name: name_str,
            license: license_str,
            address: addr,
            registration_date: clock::timestamp_ms(clock),
        };  
        
        // Assign distributor role
        drug_ledger::assign_role(admin, role_registry, addr, ROLE_DISTRIBUTOR, ctx);
        
        // Transfer distributor object to the address
        transfer::transfer(distributor, addr);
        
        event::emit(RegisteredDistributor {
            name: name_str,
            license: license_str,
            address: addr,
        });
    }

    /// Creates a new shipment for a drug.
    /// Only distributors can create shipments.
    /// 
    /// # Arguments
    /// * `distributor` - The distributor object
    /// * `drug` - The drug being shipped
    /// * `counter` - The shipment counter
    /// * `destination` - The destination address
    /// * `quantity` - The quantity being shipped
    /// * `tracking_number` - The tracking number for the shipment
    /// * `notes` - Any notes about the shipment
    /// * `role_registry` - The role registry
    /// * `clock` - The clock object for timestamp
    public entry fun create_shipment(
        distributor: &Distributor,
        drug: &Drug,
        counter: &mut ShipmentCounter,
        destination: address,
        quantity: u64,
        tracking_number: vector<u8>,
        notes: vector<u8>,
        role_registry: &RoleRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify sender is the distributor
        let sender = tx_context::sender(ctx);
        assert!(sender == distributor.address, ENotAuthorized);
        assert!(drug_ledger::is_distributor(role_registry, sender), ENotDistributor);
        
        // Drug must be in ACTIVE status
        assert!(drug_ledger::get_drug_status(drug) == 1, EInvalidDrugStatus); // 1 = ACTIVE status
        
        // Validate quantity
        assert!(quantity > 0, EInvalidQuantity);
        
        let shipment_id = counter.counter;
        counter.counter = counter.counter + 1;
        
        let timestamp = clock::timestamp_ms(clock);
        let tracking_str = string::utf8(tracking_number);
        let notes_str = string::utf8(notes);
        
        let shipment = Shipment {
            id: object::new(ctx),
            shipment_id,
            drug_id: drug_ledger::get_drug_id(drug),
            origin: sender,
            destination,
            quantity,
            status: SHIPMENT_STATUS_PENDING,
            creation_date: timestamp,
            last_updated: timestamp,
            tracking_number: tracking_str,
            notes: notes_str,
        };
        
        // Make the shipment a shared object
        transfer::share_object(shipment);
        
        // Emit shipment creation event
        event::emit(CreatedShipment {
            shipment_id,
            drug_id: drug_ledger::get_drug_id(drug),
            origin: sender,
            destination,
            quantity,
            distributor: sender,
            timestamp,
        });
        
        // Also emit a distribution record for tracking
        event::emit(DistributionRecord {
            shipment_id,
            drug_id: drug_ledger::get_drug_id(drug),
            distributor_name: distributor.name,
            destination,
            quantity,
            timestamp,
        });
    }

    /// Updates the status of a shipment.
    /// Only the distributor who created the shipment can update its status.
    /// 
    /// # Arguments
    /// * `distributor` - The distributor object
    /// * `shipment` - The shipment to update
    /// * `new_status` - The new status
    /// * `notes` - Any notes about the status update
    /// * `role_registry` - The role registry
    /// * `clock` - The clock object for timestamp
    public entry fun update_shipment_status(
        distributor: &Distributor,
        shipment: &mut Shipment,
        new_status: u8,
        notes: vector<u8>,
        role_registry: &RoleRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify sender is the distributor who created the shipment
        let sender = tx_context::sender(ctx);
        assert!(sender == distributor.address, ENotAuthorized);
        assert!(drug_ledger::is_distributor(role_registry, sender), ENotDistributor);
        assert!(shipment.origin == sender, ENotAuthorized);
        
        // Status must be valid
        assert!(new_status <= SHIPMENT_STATUS_REJECTED, EInvalidInput);
        
        let old_status = shipment.status;
        let timestamp = clock::timestamp_ms(clock);
        
        // Update shipment status
        shipment.status = new_status;
        shipment.last_updated = timestamp;
        
        // Append notes if provided
        if (vector::length(&notes) > 0) {
            let notes_str = string::utf8(notes);
            if (string::length(&shipment.notes) > 0) {
                string::append(&mut shipment.notes, string::utf8(b" | "));
            };
            string::append(&mut shipment.notes, notes_str);
        };
        
        // Emit status update event
        event::emit(UpdatedShipmentStatus {
            shipment_id: shipment.shipment_id,
            old_status,
            new_status,
            updated_by: sender,
            timestamp,
            notes: string::utf8(notes),
        });
    }

    /// Receives a shipment at the destination.
    /// Only the destination address can receive a shipment.
    /// 
    /// # Arguments
    /// * `shipment` - The shipment being received
    /// * `accept` - Whether to accept or reject the shipment
    /// * `notes` - Any notes about the receipt
    /// * `clock` - The clock object for timestamp
    public entry fun receive_shipment(
        shipment: &mut Shipment,
        accept: bool,
        notes: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify sender is the destination
        let sender = tx_context::sender(ctx);
        assert!(sender == shipment.destination, ENotAuthorized);
        
        // Shipment must be in transit
        assert!(shipment.status == SHIPMENT_STATUS_IN_TRANSIT, EInvalidDrugStatus);
        
        let old_status = shipment.status;
        let timestamp = clock::timestamp_ms(clock);
        
        // Update shipment status based on acceptance
        shipment.status = if (accept) { SHIPMENT_STATUS_DELIVERED } else { SHIPMENT_STATUS_REJECTED };
        shipment.last_updated = timestamp;
        
        // Append notes if provided
        if (vector::length(&notes) > 0) {
            let notes_str = string::utf8(notes);
            if (string::length(&shipment.notes) > 0) {
                string::append(&mut shipment.notes, string::utf8(b" | "));
            };
            string::append(&mut shipment.notes, notes_str);
        };
        
        // Emit status update event
        event::emit(UpdatedShipmentStatus {
            shipment_id: shipment.shipment_id,
            old_status,
            new_status: shipment.status,
            updated_by: sender,
            timestamp,
            notes: string::utf8(notes),
        });
    }

    /// Gets distributor information.
    /// 
    /// # Arguments
    /// * `distributor` - The distributor object
    /// 
    /// # Returns
    /// * The distributor information
    public fun get_distributor_info(distributor: &Distributor): (String, String, address, u64) {
        (
            distributor.name,
            distributor.license,
            distributor.address,
            distributor.registration_date
        )
    }

    /// Gets shipment information.
    /// 
    /// # Arguments
    /// * `shipment` - The shipment object
    /// 
    /// # Returns
    /// * The shipment information
    public fun get_shipment_info(shipment: &Shipment): (u64, u64, address, address, u64, u8, u64, u64, String, String) {
        (
            shipment.shipment_id,
            shipment.drug_id,
            shipment.origin,
            shipment.destination,
            shipment.quantity,
            shipment.status,
            shipment.creation_date,
            shipment.last_updated,
            shipment.tracking_number,
            shipment.notes
        )
    }
} 