import { motion } from 'motion/react';
import { BookOpen, FileText, Send, GraduationCap, Calendar, UserX, FileQuestion, Briefcase, MessageSquare } from 'lucide-react';

export function StudentPages() {
  const pages = [
    {
      name: 'Cours',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-700',
      desc: 'Consultation des cours et téléchargement de ressources',
      features: ['Parcourir les cours', 'Télécharger les documents', 'Voir les enseignants'],
    },
    {
      name: 'Devoirs',
      icon: FileText,
      color: 'from-purple-500 to-purple-700',
      desc: 'Liste des devoirs avec deadlines',
      features: ['Voir les devoirs actifs', 'Consulter les deadlines', 'Accéder aux détails'],
    },
    {
      name: 'Soumissions',
      icon: Send,
      color: 'from-pink-500 to-pink-700',
      desc: 'Dépôt de travaux et suivi',
      features: ['Soumettre un devoir', 'Joindre des fichiers', 'Consulter le feedback'],
    },
    {
      name: 'Notes',
      icon: GraduationCap,
      color: 'from-green-500 to-green-700',
      desc: 'Consultation des notes et demande de double correction',
      features: ['Voir toutes les notes', 'Calculer la moyenne', 'Demander une révision'],
    },
    {
      name: 'Emploi du temps',
      icon: Calendar,
      color: 'from-orange-500 to-orange-700',
      desc: 'Planning hebdomadaire des cours',
      features: ['Vue par semaine', 'Salles et horaires', 'Informations professeur'],
    },
    {
      name: 'Absences',
      icon: UserX,
      color: 'from-red-500 to-red-700',
      desc: 'Gestion et justification des absences',
      features: ['Voir les absences', 'Uploader un justificatif', 'Suivre le statut'],
    },
    {
      name: 'Demandes',
      icon: FileQuestion,
      color: 'from-cyan-500 to-cyan-700',
      desc: 'Demandes administratives',
      features: ['Créer une demande', 'Marquer comme urgent', 'Suivre l\'état'],
    },
    {
      name: 'Demandes de stage',
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-700',
      desc: 'Gestion complète des stages',
      features: ['Créer une demande', 'Infos entreprise', 'Imprimer les documents'],
    },
    {
      name: 'Réclamations',
      icon: MessageSquare,
      color: 'from-violet-500 to-violet-700',
      desc: 'Dépôt et suivi de réclamations',
      features: ['Déposer une réclamation', 'Marquer comme urgent', 'Consulter l\'historique'],
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            Pages Étudiant
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Interface complète pour la consultation, soumission et suivi académique
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pages.map((page, index) => (
            <motion.div
              key={page.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              {/* Header */}
              <div className={`h-20 bg-gradient-to-br ${page.color} flex items-center justify-center relative overflow-hidden`}>
                <motion.div
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-white/20"
                />
                <page.icon className="w-10 h-10 text-white relative z-10" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                  {page.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {page.desc}
                </p>

                {/* Features */}
                <ul className="space-y-1.5">
                  {page.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                      className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-1 h-1 rounded-full bg-pink-500" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Student Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Parcours Étudiant
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, title: 'Consulter', desc: 'Accès aux cours et ressources' },
              { icon: FileText, title: 'Soumettre', desc: 'Dépôt des devoirs' },
              { icon: GraduationCap, title: 'Suivre', desc: 'Consultation des notes' },
              { icon: MessageSquare, title: 'Communiquer', desc: 'Réclamations et demandes' },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center"
              >
                <step.icon className="w-10 h-10 mx-auto mb-3" />
                <h4 className="font-semibold mb-1">{step.title}</h4>
                <p className="text-sm text-white/80">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stage Management Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Gestion de Stage - Interface Complète
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tabs détaillés pour un suivi exhaustif
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {['Infos générales', 'Entreprise', 'Encadrement', 'Dépôt'].map((tab, index) => (
              <motion.div
                key={tab}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -3 }}
                className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center"
              >
                <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  {tab}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
