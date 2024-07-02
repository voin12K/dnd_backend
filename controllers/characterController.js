import Character from '../models/playerCharacter.js';

export const createCharacter = async (req, res) => {
  try {
    const characterData = req.body;

    if (!characterData.name || !characterData.lvl || !characterData.exp || !characterData.account || !characterData.room || !characterData.race || !characterData.class || !characterData.age || !characterData.hp || !characterData.hit_dice || !characterData.max_hp || !characterData.ac || !characterData.initiative || !characterData.speed || !characterData.proficiency || !characterData.playerName) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newCharacter = await Character.create(characterData);
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
