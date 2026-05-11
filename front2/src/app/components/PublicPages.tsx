import { motion } from 'motion/react';
import { LogIn, ShieldAlert, Eye, EyeOff, Mail, Lock as LockIcon } from 'lucide-react';

export function PublicPages() {
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
            Pages Publiques
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Pages accessibles sans authentification
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Login Page */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Page Connexion
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Authentification utilisateur
                </p>
              </div>
            </div>

            {/* Login Form Preview */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
              <div className="space-y-4">
                {/* Role Selector */}
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    Sélectionner le profil
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Admin', 'Enseignant', 'Étudiant'].map((role, i) => (
                      <motion.div
                        key={role}
                        whileHover={{ scale: 1.05 }}
                        className={`p-3 rounded-lg border-2 text-center text-xs font-medium cursor-pointer ${
                          i === 0
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {role}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    Email
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    Mot de passe
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <LockIcon className="w-4 h-4 text-slate-400" />
                    <div className="h-4 flex-1 bg-slate-200 dark:bg-slate-700 rounded" />
                    <Eye className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium"
                >
                  Se connecter
                </motion.button>
              </div>
            </div>

            {/* Attributes */}
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                États & Attributs :
              </h4>
              <div className="flex flex-wrap gap-2">
                {['email', 'password', 'showPassword', 'selectedRole', 'loading', 'errorMessage'].map((attr) => (
                  <span
                    key={attr}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full text-xs font-mono"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Access Denied Page */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Page Accès Refusé
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gestion des permissions
                </p>
              </div>
            </div>

            {/* Access Denied Preview */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border-2 border-slate-200 dark:border-slate-700 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center"
              >
                <ShieldAlert className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Accès Refusé
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium"
              >
                Retour à l'accueil
              </motion.button>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                  Composition :
                </h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Titre "Accès refusé"</li>
                  <li>• Texte explicatif</li>
                  <li>• Bouton de retour</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
