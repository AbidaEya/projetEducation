import { motion } from 'motion/react';
import { BarChart3, User, Bell, TrendingUp, Users, BookOpen } from 'lucide-react';

export function CommonPages() {
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
            Pages Communes
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Pages accessibles par tous les utilisateurs connectés
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Dashboard (Tableau de bord)
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Vue rapide de l'activité avec compteurs personnalisés
                </p>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: Users, label: 'Utilisateurs', value: '1,234', color: 'blue' },
                { icon: BookOpen, label: 'Cours', value: '89', color: 'purple' },
                { icon: TrendingUp, label: 'Notes', value: '456', color: 'pink' },
                { icon: Bell, label: 'Notifications', value: '23', color: 'orange' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`p-4 rounded-xl bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-950 dark:to-${stat.color}-900 border border-${stat.color}-200 dark:border-${stat.color}-800`}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400 mb-2`} />
                  <div className={`text-2xl font-bold text-${stat.color}-700 dark:text-${stat.color}-300`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                  Admin
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Compteurs globaux (entités académiques, utilisateurs)
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-2">
                  Enseignant
                </h4>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Cours, classes, devoirs, évaluations
                </p>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-pink-950 rounded-lg border border-pink-200 dark:border-pink-800">
                <h4 className="font-semibold text-sm text-pink-900 dark:text-pink-100 mb-2">
                  Étudiant
                </h4>
                <p className="text-xs text-pink-700 dark:text-pink-300">
                  Devoirs, soumissions, notifications
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile & Notifications */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Profil
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Informations personnelles
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full mt-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                >
                  Modifier
                </motion.button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {['profilePicture', 'editModalOpen', 'formFirstName', 'saving'].map((attr) => (
                  <span
                    key={attr}
                    className="px-2 py-1 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded text-xs font-mono"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Centre de notifications
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
                <div className="flex gap-2 mb-4">
                  {['Toutes', 'Non lues', 'Lues'].map((filter, i) => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        i === 0
                          ? 'bg-orange-500 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {filter}
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${i === 1 ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <div className="flex-1">
                          <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                          <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {['filterMode', 'notifications', 'unreadCount', 'loading'].map((attr) => (
                  <span
                    key={attr}
                    className="px-2 py-1 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded text-xs font-mono"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
