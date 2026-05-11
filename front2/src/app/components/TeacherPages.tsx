import { motion } from 'motion/react';
import { BookOpen, Users, FileText, ClipboardCheck, AlertCircle, Calendar, Send } from 'lucide-react';

export function TeacherPages() {
  const pages = [
    {
      name: 'Cours',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-700',
      desc: 'Création et gestion des cours avec ressources',
      features: ['Créer un cours', 'Uploader des ressources', 'Gérer les documents'],
    },
    {
      name: 'Classes',
      icon: Users,
      color: 'from-purple-500 to-purple-700',
      desc: 'Gestion des classes et groupes d\'étudiants',
      features: ['Créer une classe', 'Assigner des étudiants', 'Modifier les détails'],
    },
    {
      name: 'Devoirs',
      icon: FileText,
      color: 'from-pink-500 to-pink-700',
      desc: 'Création et suivi des devoirs',
      features: ['Créer un devoir', 'Définir la deadline', 'Attacher des fichiers'],
    },
    {
      name: 'Évaluations',
      icon: ClipboardCheck,
      color: 'from-green-500 to-green-700',
      desc: 'Correction et notation des soumissions',
      features: ['Voir les soumissions', 'Attribuer une note', 'Ajouter un feedback'],
    },
    {
      name: 'Réclamations de notes',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-700',
      desc: 'Traitement des réclamations étudiantes',
      features: ['Consulter la réclamation', 'Accepter/Refuser', 'Ajouter un commentaire'],
    },
    {
      name: 'Emploi du temps',
      icon: Calendar,
      color: 'from-cyan-500 to-cyan-700',
      desc: 'Visualisation du planning des cours',
      features: ['Planning hebdomadaire', 'Salles et horaires', 'Filtres par classe'],
    },
    {
      name: 'Notifications',
      icon: Send,
      color: 'from-indigo-500 to-indigo-700',
      desc: 'Envoi de notifications aux étudiants',
      features: ['Créer une notification', 'Cibler des étudiants', 'Historique et statuts'],
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Pages Enseignant
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Outils pour la création de contenu, l'évaluation et la communication
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <motion.div
              key={page.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              {/* Header */}
              <div className={`h-24 bg-gradient-to-br ${page.color} flex items-center justify-center relative overflow-hidden`}>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-white/10"
                />
                <page.icon className="w-12 h-12 text-white relative z-10" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  {page.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {page.desc}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {page.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Evaluation Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6" />
            Workflow d'Évaluation
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="text-4xl font-bold mb-2">1</div>
              <h4 className="font-semibold mb-2">Soumissions en attente</h4>
              <p className="text-sm text-white/80">
                Consultation des travaux soumis par les étudiants
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="text-4xl font-bold mb-2">2</div>
              <h4 className="font-semibold mb-2">Évaluation</h4>
              <p className="text-sm text-white/80">
                Attribution d'une note et rédaction d'un feedback personnalisé
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="text-4xl font-bold mb-2">3</div>
              <h4 className="font-semibold mb-2">Historique</h4>
              <p className="text-sm text-white/80">
                Suivi des évaluations complétées avec possibilité de révision
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
