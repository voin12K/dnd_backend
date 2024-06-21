const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savingThrowSchema = new Schema({
    proficiency: { type: Boolean, default: false },
    modifier: { type: Number, default: 0 }
}, { _id: false });

const savingThrowsSchema = new Schema({
    strength: savingThrowSchema,
    dexterity: savingThrowSchema,
    constitution: savingThrowSchema,
    intelligence: savingThrowSchema,
    wisdom: savingThrowSchema,
    charisma: savingThrowSchema
}, { _id: false });

const skillSchema = new Schema({
    proficiency: { type: Boolean, default: false },
    modifier: { type: Number, default: 0 }
}, { _id: false });
 
const skillsSchema = new Schema({    
    acrobatics: skillSchema,         
    animalHandling: skillSchema,     
    arcana: skillSchema,             
    athletics: skillSchema,          
    deception: skillSchema,          
    history: skillSchema,            
    insight: skillSchema,            
    intimidation: skillSchema,       
    investigation: skillSchema,      
    medicine: skillSchema,           
    nature: skillSchema,             
    perception: skillSchema,         
    performance: skillSchema,        
    persuasion: skillSchema,         
    religion: skillSchema,           
    sleightOfHand: skillSchema,      
    stealth: skillSchema,             
    survival: skillSchema            
}, { _id: false });

const spellSlotSchema = new Schema({
    level: { type: Number, required: true },
    slots: { type: Number, required: true },
    used: { type: Number, default: 0 }
}, { _id: false });

const spellSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: Number, required: true }
}, { _id: false });

const characterSchema = new Schema({
    name: { type: String, required: true },
    lvl: {type: String, required: true},
    exp: {type: String, required: true},
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    race: { type: String, required: true },
    class: { type: String, required: true },
    age: { type: String, required: true },
    hp: {type: String, required: true},
    hit_dace: {type: String, required: true},
    max_hp: {type: String, required: true},
    ac: { type: String, required: true },
    initiative: { type: String, required: true },
    speed: { type: String, required: true },
    proficiency: { type: String, required: true },
    playerName: { type: String, required: true },
    mainStats: {
        strength: { type: Number, required: true },
        dexterity: { type: Number, required: true },
        constitution: { type: Number, required: true },
        intelligence: { type: Number, required: true },
        wisdom: { type: Number, required: true },
        charisma: { type: Number, required: true }
    },
    bonusStats: {
        bonusStrength: { type: Number, required: true },
        bonusDexterity: { type: Number, required: true },
        bonusConstitution: { type: Number, required: true },
        bonusIntelligence: { type: Number, required: true },
        bonusWisdom: { type: Number, required: true },
        bonusCharisma: { type: Number, required: true }
    },
    savingThrows: { type: savingThrowsSchema, default: () => ({}) },
    skills: { type: skillsSchema, default: () => ({}) },
    spellSlots: { type: [spellSlotSchema], default: [] }, 
    spells: { type: [spellSchema], default: [] } 
});

module.exports = mongoose.model('Character', characterSchema);
