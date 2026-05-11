import { motion } from 'motion/react';
import { Database, CheckCircle, FileText, UserCheck, Star, MessageSquare, Settings } from 'lucide-react';

export function AdminPages() {
  const crudPages = [
    'Utilisateurs', 'Admins', 'Enseignants', 'Étudiants', 
    'Départements', 'Groupes', 'Classes', 'Cours', 
    'Devoirs', 'Matières', 'Projets', 'Emploi du temps'
  ];

  const workflowPages = [
    { name: 'Soumissions', icon: FileText, desc: 'Consulter et évaluer les soumissions' },
    { name: 'Absences', icon: CheckCircle, desc: 'Accepter ou refuser les absences' },
    { name: 'Justifications', icon: UserCheck, desc: 'Valider les justificatifs' },
    { name: 'Demandes', icon: MessageSquare, desc: 'Traiter les demandes administratives' },
    { name: 'Demandes de stage', icon: Settings, desc: 'Gérer les demandes de stage' },
    { name: 'Notes & Double correction', icon: Star, desc: 'Gestion des notes et corrections' },
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pages Administrateur
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Gestion complète du système avec écrans CRUD et workflows de validation
          </p>
        </motion.div>

        {/* CRUD Pages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Écrans CRUD (Create, Read, Update, Delete)
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                12 interfaces de gestion de ressources
              </p>
            </div>
          </div>

          {/* CRUD Interface Preview */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6 border-2 border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                + Ajouter
              </motion.div>
            </div>
            
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded" />
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-950 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CRUD Pages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {crudPages.map((page, index) => (
              <motion.div
                key={page}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.02 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800 text-center"
              >
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {page}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
              Fonctionnalités communes :
            </h4>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-blue-700 dark:text-blue-300">
              <div>• Recherche dynamique</div>
              <div>• Filtrage par colonnes</div>
              <div>• Modals de création/édition</div>
              <div>• Validation de formulaires</div>
              <div>• Suppression avec confirmation</div>
              <div>• États de chargement</div>
            </div>
          </div>
        </motion.div>

        {/* Workflow Pages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Pages de Workflow (Validation & Approbation)
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowPages.map((page, index) => (
              <motion.div
                key={page.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800 shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <page.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                  {page.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {page.desc}
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 text-center py-2 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                    Accepter
                  </div>
                  <div className="flex-1 text-center py-2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                    Refuser
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
