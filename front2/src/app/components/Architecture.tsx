import { motion } from 'motion/react';
import { Layers, Database, Lock, RefreshCw, Zap, Shield } from 'lucide-react';

export function Architecture() {
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
            Architecture & Flux de Données
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Vue d'ensemble de l'architecture technique et des flux d'information
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mb-8 border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-2xl font-bold mb-8 text-center text-slate-900 dark:text-white">
            Architecture en Couches
          </h3>

          <div className="space-y-6">
            {/* Presentation Layer */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="w-8 h-8" />
                  <h4 className="text-xl font-bold">Couche Présentation</h4>
                </div>
                <div className="grid md:grid-cols-4 gap-3">
                  {['Components', 'Pages', 'Routing', 'UI/UX'].map((item) => (
                    <div key={item} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <RefreshCw className="w-6 h-6 text-slate-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Business Logic Layer */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mt-8"
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8" />
                  <h4 className="text-xl font-bold">Couche Logique Métier</h4>
                </div>
                <div className="grid md:grid-cols-4 gap-3">
                  {['Validation', 'Workflows', 'Business Rules', 'State Management'].map((item) => (
                    <div key={item} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <RefreshCw className="w-6 h-6 text-slate-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Data Layer */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative mt-8"
            >
              <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-8 h-8" />
                  <h4 className="text-xl font-bold">Couche Données</h4>
                </div>
                <div className="grid md:grid-cols-4 gap-3">
                  {['API Calls', 'Data Models', 'Cache', 'Persistence'].map((item) => (
                    <div key={item} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <RefreshCw className="w-6 h-6 text-slate-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Security Layer */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8" />
                  <h4 className="text-xl font-bold">Couche Sécurité</h4>
                </div>
                <div className="grid md:grid-cols-4 gap-3">
                  {['Authentication', 'Authorization', 'Role-Based Access', 'Data Protection'].map((item) => (
                    <div key={item} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Data Flow */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Flux de Données
            </h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Action Utilisateur', desc: 'Click, form submit, navigation' },
                { step: '2', title: 'Validation', desc: 'Contrôle des données et permissions' },
                { step: '3', title: 'Traitement', desc: 'Logique métier et transformation' },
                { step: '4', title: 'Mise à jour', desc: 'Synchronisation de l\'état' },
                { step: '5', title: 'Affichage', desc: 'Re-render des composants' },
              ].map((flow, index) => (
                <motion.div
                  key={flow.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {flow.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{flow.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{flow.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Technologies Clés
            </h3>
            <div className="space-y-3">
              {[
                { name: 'React', desc: 'Framework UI avec composants réutilisables', color: 'blue' },
                { name: 'TypeScript', desc: 'Typage statique pour fiabilité', color: 'purple' },
                { name: 'Tailwind CSS', desc: 'Styling utilitaire et responsive', color: 'cyan' },
                { name: 'Motion', desc: 'Animations fluides et modernes', color: 'pink' },
                { name: 'React Router', desc: 'Navigation et routing', color: 'orange' },
                { name: 'Lucide Icons', desc: 'Bibliothèque d\'icônes', color: 'green' },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className={`p-4 bg-${tech.color}-50 dark:bg-${tech.color}-950 rounded-lg border border-${tech.color}-200 dark:border-${tech.color}-800`}
                >
                  <h4 className={`font-semibold text-${tech.color}-700 dark:text-${tech.color}-300 mb-1`}>
                    {tech.name}
                  </h4>
                  <p className={`text-sm text-${tech.color}-600 dark:text-${tech.color}-400`}>
                    {tech.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">
            Vue d'Ensemble du Projet
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '31+', label: 'Pages Total', icon: Layers },
              { value: '3', label: 'Rôles Utilisateur', icon: Lock },
              { value: '12+', label: 'Écrans CRUD', icon: Database },
              { value: '10+', label: 'Composants UI', icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
