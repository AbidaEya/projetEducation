import { motion } from 'motion/react';
import { LayoutDashboard, Menu, Bell, User, Moon, LogOut, ChevronRight } from 'lucide-react';

export function GlobalStructure() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Structure Globale
          </h2>
          <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
            Une architecture cohérente avec sidebar, topbar et zone centrale
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Layout Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              Layout Interactif
            </h3>
            
            {/* Miniature Layout */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-700">
              <div className="flex gap-2 h-64">
                {/* Sidebar */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-16 bg-gradient-to-b from-blue-600 to-purple-600 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full mx-auto" />
                  <div className="flex-1 space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-full h-8 bg-white/10 rounded" />
                    ))}
                  </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-2">
                  {/* Topbar */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="h-12 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-between px-4 shadow-sm cursor-pointer"
                  >
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded" />
                      <div className="w-32 h-4 bg-slate-200 dark:bg-slate-600 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded-full" />
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded-full" />
                    </div>
                  </motion.div>

                  {/* Content Area */}
                  <div className="flex-1 bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
                      <div className="h-20 bg-slate-100 dark:bg-slate-600/50 rounded" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Components Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {[
              {
                icon: Menu,
                title: 'Sidebar (Menu)',
                description: 'Navigation organisée par sections avec filtrage par rôle',
                features: ['Identité utilisateur', 'Groupes de navigation', 'État réduit/étendu'],
                color: 'blue',
              },
              {
                icon: Bell,
                title: 'Topbar (Barre du haut)',
                description: 'Actions globales et paramètres utilisateur',
                features: ['Notifications', 'Profil', 'Toggle thème', 'Déconnexion'],
                color: 'purple',
              },
              {
                icon: LayoutDashboard,
                title: 'Zone Centrale',
                description: 'Contenu dynamique selon la page active',
                features: ['Responsive', 'Modals', 'Toasts', 'Formulaires'],
                color: 'pink',
              },
            ].map((component, index) => (
              <motion.div
                key={component.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-lg"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${component.color}-500 to-${component.color}-600 flex items-center justify-center mb-3`}>
                  <component.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                  {component.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {component.description}
                </p>
                <ul className="space-y-1">
                  {component.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
