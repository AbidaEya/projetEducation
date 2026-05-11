import { motion } from 'motion/react';
import { Box, Square, Bell as BellIcon, Table, AlertCircle } from 'lucide-react';

export function ComponentsSection() {
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
            Composants Réutilisables
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Bibliothèque de composants UI pour une expérience cohérente
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Box className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Section (Bloc)
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Structure de page
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="h-5 w-40 bg-slate-300 dark:bg-slate-600 rounded mb-2" />
                <div className="h-3 w-56 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                Composition :
              </h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Header (titre + sous-titre)</li>
                <li>• Body (contenu)</li>
              </ul>
            </div>
          </motion.div>

          {/* Modal Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <Square className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Modal (Fenêtre)
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  CRUD et consultation
                </p>
              </div>
            </div>

            <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-4 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                      <div className="h-8 bg-slate-100 dark:bg-slate-900 rounded" />
                    </div>
                    <div>
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                      <div className="h-8 bg-slate-100 dark:bg-slate-900 rounded" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="flex-1 h-8 bg-purple-500 rounded" />
                  </div>
                </motion.div>
              </div>
              <div className="h-40" />
            </div>

            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-2">
                Éléments :
              </h4>
              <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                <li>• Backdrop (fond sombre)</li>
                <li>• Header avec bouton fermer</li>
                <li>• Body (contenu)</li>
                <li>• Footer (actions)</li>
              </ul>
            </div>
          </motion.div>

          {/* Toast Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                <BellIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Toast (Notification)
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Feedback utilisateur
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { type: 'success', color: 'green', text: 'Opération réussie' },
                { type: 'error', color: 'red', text: 'Une erreur est survenue' },
                { type: 'info', color: 'blue', text: 'Information importante' },
              ].map((toast, index) => (
                <motion.div
                  key={toast.type}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className={`p-4 bg-${toast.color}-50 dark:bg-${toast.color}-950 border border-${toast.color}-200 dark:border-${toast.color}-800 rounded-lg flex items-center gap-3 shadow-lg`}
                >
                  <div className={`w-2 h-2 rounded-full bg-${toast.color}-500`} />
                  <span className={`text-sm font-medium text-${toast.color}-700 dark:text-${toast.color}-300`}>
                    {toast.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-sm text-green-900 dark:text-green-100 mb-2">
                Attributs :
              </h4>
              <div className="flex flex-wrap gap-2">
                {['message', 'type', 'durée'].map((attr) => (
                  <span
                    key={attr}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-mono"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CRUD Table Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
                <Table className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  CRUD Générique
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tableau dynamique
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 p-2 bg-slate-200 dark:bg-slate-700 rounded">
                  {['Nom', 'Email', 'Rôle', 'Actions'].map((header) => (
                    <div key={header} className="h-3 bg-slate-300 dark:bg-slate-600 rounded" />
                  ))}
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-2 bg-white dark:bg-slate-800 rounded">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="flex gap-1">
                      <div className="h-3 w-8 bg-blue-200 dark:bg-blue-800 rounded" />
                      <div className="h-3 w-8 bg-red-200 dark:bg-red-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100 mb-2">
                Fonctionnalités :
              </h4>
              <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                <li>• Génération automatique de colonnes</li>
                <li>• Actions modifier/supprimer</li>
                <li>• Formulaire dynamique</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Error Boundary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h3 className="text-2xl font-bold">ErrorBoundary</h3>
          </div>
          <p className="text-white/90 mb-6">
            Composant de gestion d'erreur pour afficher un écran de secours en cas d'erreur React, 
            garantissant une expérience utilisateur stable même en cas de problème.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Sans ErrorBoundary</h4>
              <p className="text-sm text-white/80">L'application entière crash</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Avec ErrorBoundary</h4>
              <p className="text-sm text-white/80">Écran de récupération élégant</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
