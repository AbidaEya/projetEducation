import { motion } from 'motion/react';
import { Shield, User, GraduationCap, Lock, Check } from 'lucide-react';

export function RolesAccess() {
  const roles = [
    {
      name: 'Administrateur',
      icon: Shield,
      color: 'from-blue-500 to-blue-700',
      permissions: [
        'Gestion complète des utilisateurs',
        'Validation des demandes',
        'Approbation des notifications',
        'Gestion des entités académiques',
        'Évaluation des soumissions',
        'Traitement des réclamations',
      ],
      pages: 15,
    },
    {
      name: 'Enseignant',
      icon: User,
      color: 'from-purple-500 to-purple-700',
      permissions: [
        'Création et gestion de cours',
        'Gestion des devoirs',
        'Évaluation des étudiants',
        'Upload de ressources',
        'Envoi de notifications',
        'Gestion des classes',
      ],
      pages: 7,
    },
    {
      name: 'Étudiant',
      icon: GraduationCap,
      color: 'from-pink-500 to-pink-700',
      permissions: [
        'Consultation des cours',
        'Soumission de devoirs',
        'Consultation des notes',
        'Gestion des absences',
        'Demandes administratives',
        'Demandes de stage',
      ],
      pages: 9,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rôles & Contrôle d'Accès
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Trois rôles distincts avec des permissions et des pages spécifiques
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <div className={`h-32 bg-gradient-to-br ${role.color} flex items-center justify-center relative overflow-hidden`}>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-white/10"
                />
                <role.icon className="w-16 h-16 text-white relative z-10" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                  {role.name}
                </h3>
                <div className="flex items-center gap-2 mb-4 text-sm text-slate-500 dark:text-slate-400">
                  <Lock className="w-4 h-4" />
                  <span>{role.pages} pages accessibles</span>
                </div>

                <ul className="space-y-2">
                  {role.permissions.map((permission, i) => (
                    <motion.li
                      key={permission}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{permission}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Access Rules */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Règles de Sécurité
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Utilisateurs Non Connectés</h4>
              <p className="text-sm text-white/80">
                Accès uniquement aux pages publiques (connexion, accès refusé)
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Utilisateurs Connectés</h4>
              <p className="text-sm text-white/80">
                Accès limité aux pages autorisées selon leur rôle spécifique
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
