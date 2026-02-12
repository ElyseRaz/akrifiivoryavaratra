import "dotenv/config";
const Utilisateur = require('../models/utilisateurs.model');

async function main() {
  try {
    const user = await Utilisateur.addUtilisateur({
      nom_utilisateur: 'Elysé',
      email: 'erazafindravonjy@gmail.com',
      mot_de_passe: 'Zeze1234.',
    });
    console.log('User created:', user);
    process.exit(0);
  } catch (err) {
    console.error('Error creating user:', err);
    process.exit(1);
  }
}

main();
