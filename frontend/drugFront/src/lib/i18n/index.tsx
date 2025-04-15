"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getCookie, setCookie } from "cookies-next"

// Available languages
export type Language = "en" | "es" | "fr" | "de" | "zh"

// Default translations map - to be extended with actual translations
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    profile: "Profile",
    notifications: "Notifications",
    settings: "Settings",
    help: "Help Center",
    logout: "Logout",

    // Roles
    admin: "Admin",
    manufacturer: "Manufacturer",
    distributor: "Distributor",
    regulator: "Regulator",
    public: "Public",

    // Common
    search: "Search...",
    viewAll: "View All",
    save: "Save",
    cancel: "Cancel",
    refresh: "Refresh",
    loading: "Loading...",

    // Settings
    languageSettings: "Language Settings",
    interfaceLanguage: "Interface Language",
    autoDetectLanguage: "Auto-detect language",
    saveLanguagePreferences: "Save Language Preferences",

    // Languages
    english: "English",
    spanish: "Spanish",
    french: "French",
    german: "German",
    chinese: "Chinese",

    // Admin Dashboard
    adminDashboard: "Admin Dashboard",
    adminDashboardDescription: "Manage system roles and monitor platform activity",
    refreshing: "Refreshing...",
    refreshData: "Refresh Data",
    totalUsers: "Total Users",
    targetReached: "70% of target reached",
    pendingApprovals: "Pending Approvals",
    needsAttention: "Needs attention",
    awaitingReview: "Awaiting review by admin",
    systemLoad: "System Load",
    live: "Live",
    systemPerformanceNormal: "System performance normal",
    activeEntities: "Active Entities",
    systemAnalytics: "System Analytics",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    userGrowthTrend: "User Growth Trend",
    systemPerformanceMetrics: "System Performance Metrics",
    systemStatus: "System Status",
    userDistribution: "User Distribution",
    systemMetrics: "System Metrics",
    uptime: "Uptime",
    apiRequestsToday: "API Requests (today)",
    databaseSize: "Database Size",
    lastBackup: "Last Backup",
    activeBlockchainNodes: "Active Blockchain Nodes",
    viewSystemHealth: "View System Health",
    databaseManagement: "Database Management",
    recentActivity: "Recent Activity",
    systemAlerts: "System Alerts",
    active: "active",
    manageAlertSettings: "Manage Alert Settings",
    quickActions: "Quick Actions",
    manageRoles: "Manage Roles",
    systemUpgrades: "System Upgrades",
    viewAuditLogs: "View Audit Logs",
    backupSystem: "Backup System",

    // Admin Navigation
    roleManagement: "Role Management",
    analytics: "Analytics",
    database: "Database",

    // Admin Sections
    administration: "Administration",
    manufacturing: "Manufacturing",
    regulation: "Regulation",
    distribution: "Distribution",
    publicAccess: "Public Access",
    resources: "Resources",
    general: "General",

    // Chart Labels
    userGrowth: "User Growth",
    manufacturers: "Manufacturers",
    distributors: "Distributors",
    regulators: "Regulators",
    admins: "Admins",
    apiRequests: "API Requests (K)",
    databaseQueries: "Database Queries (K)",
    blockchainOps: "Blockchain Ops (K)",

    // Manufacturer
    registerProduct: "Register Product",
    myProducts: "My Products",

    // Regulator
    issueTracker: "Issue Tracker",
    auditTrail: "Audit Trail",

    // Distributor
    shipmentTracking: "Shipment Tracking",

    // Public
    reportIssue: "Report Issue",
    searchProducts: "Search Products",
    faq: "FAQ",

    // Notifications
    loggedOutSuccessfully: "Logged Out Successfully",
    loggedOutDescription: "You have been securely logged out of your account.",

    // Activity translations
    RoleAssigned: "Role Assigned",
    RoleRevoked: "Role Revoked",
    SystemUpgrade: "System Upgrade",

    // Alert translations
    UnusualAPIActivity: "Unusual API Activity",
    DetectedhighvolumeofAPIrequestsfromIP192: "Detected high volume of API requests from IP 192.168.1.45",
    DatabaseBackupScheduled: "Database Backup Scheduled",
    Automaticbackupscheduledfortonightat02: "Automatic backup scheduled for tonight at 02:00 UTC",
    NodeSynchronizationIssue: "Node Synchronization Issue",
    Blockchainnode: "Blockchain node #5 is out of sync. Automatic resync initiated.",
  },

  es: {
    // Navigation
    dashboard: "Panel de control",
    profile: "Perfil",
    notifications: "Notificaciones",
    settings: "Configuración",
    help: "Centro de ayuda",
    logout: "Cerrar sesión",

    // Roles
    admin: "Administrador",
    manufacturer: "Fabricante",
    distributor: "Distribuidor",
    regulator: "Regulador",
    public: "Público",

    // Common
    search: "Buscar...",
    viewAll: "Ver todo",
    save: "Guardar",
    cancel: "Cancelar",
    refresh: "Actualizar",
    loading: "Cargando...",

    // Settings
    languageSettings: "Configuración de idioma",
    interfaceLanguage: "Idioma de la interfaz",
    autoDetectLanguage: "Detectar idioma automáticamente",
    saveLanguagePreferences: "Guardar preferencias de idioma",

    // Languages
    english: "Inglés",
    spanish: "Español",
    french: "Francés",
    german: "Alemán",
    chinese: "Chino",

    // Admin Dashboard
    adminDashboard: "Panel de Administrador",
    adminDashboardDescription: "Gestionar roles del sistema y monitorear la actividad de la plataforma",
    refreshing: "Actualizando...",
    refreshData: "Actualizar Datos",
    totalUsers: "Usuarios Totales",
    targetReached: "70% del objetivo alcanzado",
    pendingApprovals: "Aprobaciones Pendientes",
    needsAttention: "Necesita atención",
    awaitingReview: "Esperando revisión del administrador",
    systemLoad: "Carga del Sistema",
    live: "En vivo",
    systemPerformanceNormal: "Rendimiento del sistema normal",
    activeEntities: "Entidades Activas",
    systemAnalytics: "Análisis del Sistema",
    daily: "Diario",
    weekly: "Semanal",
    monthly: "Mensual",
    userGrowthTrend: "Tendencia de Crecimiento de Usuarios",
    systemPerformanceMetrics: "Métricas de Rendimiento del Sistema",
    systemStatus: "Estado del Sistema",
    userDistribution: "Distribución de Usuarios",
    systemMetrics: "Métricas del Sistema",
    uptime: "Tiempo de Actividad",
    apiRequestsToday: "Solicitudes API (hoy)",
    databaseSize: "Tamaño de la Base de Datos",
    lastBackup: "Última Copia de Seguridad",
    activeBlockchainNodes: "Nodos Blockchain Activos",
    viewSystemHealth: "Ver Salud del Sistema",
    databaseManagement: "Gestión de Base de Datos",
    recentActivity: "Actividad Reciente",
    systemAlerts: "Alertas del Sistema",
    active: "activas",
    manageAlertSettings: "Gestionar Configuración de Alertas",
    quickActions: "Acciones Rápidas",
    manageRoles: "Gestionar Roles",
    systemUpgrades: "Actualizaciones del Sistema",
    viewAuditLogs: "Ver Registros de Auditoría",
    backupSystem: "Respaldar Sistema",

    // Admin Navigation
    roleManagement: "Gestión de Roles",
    analytics: "Analíticas",
    database: "Base de Datos",

    // Admin Sections
    administration: "Administración",
    manufacturing: "Fabricación",
    regulation: "Regulación",
    distribution: "Distribución",
    publicAccess: "Acceso Público",
    resources: "Recursos",
    general: "General",

    // Chart Labels
    userGrowth: "Crecimiento de Usuarios",
    manufacturers: "Fabricantes",
    distributors: "Distribuidores",
    regulators: "Reguladores",
    admins: "Administradores",
    apiRequests: "Solicitudes API (K)",
    databaseQueries: "Consultas de Base de Datos (K)",
    blockchainOps: "Operaciones Blockchain (K)",

    // Manufacturer
    registerProduct: "Registrar Producto",
    myProducts: "Mis Productos",

    // Regulator
    issueTracker: "Seguimiento de Problemas",
    auditTrail: "Registro de Auditoría",

    // Distributor
    shipmentTracking: "Seguimiento de Envíos",

    // Public
    reportIssue: "Reportar Problema",
    searchProducts: "Buscar Productos",
    faq: "Preguntas Frecuentes",

    // Notifications
    loggedOutSuccessfully: "Sesión Cerrada Exitosamente",
    loggedOutDescription: "Has cerrado sesión de forma segura en tu cuenta.",

    // Activity translations
    RoleAssigned: "Rol Asignado",
    RoleRevoked: "Rol Revocado",
    SystemUpgrade: "Actualización del Sistema",

    // Alert translations
    UnusualAPIActivity: "Actividad API Inusual",
    DetectedhighvolumeofAPIrequestsfromIP192: "Detectado alto volumen de solicitudes API desde IP 192.168.1.45",
    DatabaseBackupScheduled: "Copia de Seguridad Programada",
    Automaticbackupscheduledfortonightat02: "Copia de seguridad automática programada para esta noche a las 02:00 UTC",
    NodeSynchronizationIssue: "Problema de Sincronización de Nodo",
    Blockchainnode: "Nodo blockchain #5 está fuera de sincronización. Resincronización automática iniciada.",
  },

  fr: {
    // Navigation
    dashboard: "Tableau de bord",
    profile: "Profil",
    notifications: "Notifications",
    settings: "Paramètres",
    help: "Centre d'aide",
    logout: "Déconnexion",

    // Roles
    admin: "Administrateur",
    manufacturer: "Fabricant",
    distributor: "Distributeur",
    regulator: "Régulateur",
    public: "Public",

    // Common
    search: "Rechercher...",
    viewAll: "Voir tout",
    save: "Enregistrer",
    cancel: "Annuler",
    refresh: "Actualiser",
    loading: "Chargement...",

    // Settings
    languageSettings: "Paramètres de langue",
    interfaceLanguage: "Langue de l'interface",
    autoDetectLanguage: "Détecter automatiquement la langue",
    saveLanguagePreferences: "Enregistrer les préférences de langue",

    // Languages
    english: "Anglais",
    spanish: "Espagnol",
    french: "Français",
    german: "Allemand",
    chinese: "Chinois",

    // Admin Dashboard
    adminDashboard: "Tableau de Bord Admin",
    adminDashboardDescription: "Gérer les rôles du système et surveiller l'activité de la plateforme",
    refreshing: "Actualisation...",
    refreshData: "Actualiser les Données",
    totalUsers: "Utilisateurs Totaux",
    targetReached: "70% de l'objectif atteint",
    pendingApprovals: "Approbations en Attente",
    needsAttention: "Nécessite attention",
    awaitingReview: "En attente de révision par l'administrateur",
    systemLoad: "Charge du Système",
    live: "En direct",
    systemPerformanceNormal: "Performance du système normale",
    activeEntities: "Entités Actives",
    systemAnalytics: "Analytique du Système",
    daily: "Quotidien",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    userGrowthTrend: "Tendance de Croissance des Utilisateurs",
    systemPerformanceMetrics: "Métriques de Performance du Système",
    systemStatus: "État du Système",
    userDistribution: "Distribution des Utilisateurs",
    systemMetrics: "Métriques du Système",
    uptime: "Temps de Fonctionnement",
    apiRequestsToday: "Requêtes API (aujourd'hui)",
    databaseSize: "Taille de la Base de Données",
    lastBackup: "Dernière Sauvegarde",
    activeBlockchainNodes: "Nœuds Blockchain Actifs",
    viewSystemHealth: "Voir la Santé du Système",
    databaseManagement: "Gestion de la Base de Données",
    recentActivity: "Activité Récente",
    systemAlerts: "Alertes Système",
    active: "actives",
    manageAlertSettings: "Gérer les Paramètres d'Alerte",
    quickActions: "Actions Rapides",
    manageRoles: "Gérer les Rôles",
    systemUpgrades: "Mises à Niveau du Système",
    viewAuditLogs: "Voir les Journaux d'Audit",
    backupSystem: "Sauvegarder le Système",

    // Admin Navigation
    roleManagement: "Gestion des Rôles",
    analytics: "Analytique",
    database: "Base de Données",

    // Admin Sections
    administration: "Administration",
    manufacturing: "Fabrication",
    regulation: "Régulation",
    distribution: "Distribution",
    publicAccess: "Accès Public",
    resources: "Ressources",
    general: "Général",

    // Chart Labels
    userGrowth: "Croissance des Utilisateurs",
    manufacturers: "Fabricants",
    distributors: "Distributeurs",
    regulators: "Régulateurs",
    admins: "Administrateurs",
    apiRequests: "Requêtes API (K)",
    databaseQueries: "Requêtes de Base de Données (K)",
    blockchainOps: "Opérations Blockchain (K)",

    // Manufacturer
    registerProduct: "Enregistrer un Produit",
    myProducts: "Mes Produits",

    // Regulator
    issueTracker: "Suivi des Problèmes",
    auditTrail: "Piste d'Audit",

    // Distributor
    shipmentTracking: "Suivi des Expéditions",

    // Public
    reportIssue: "Signaler un Problème",
    searchProducts: "Rechercher des Produits",
    faq: "FAQ",

    // Notifications
    loggedOutSuccessfully: "Déconnecté avec Succès",
    loggedOutDescription: "Vous avez été déconnecté en toute sécurité de votre compte.",

    // Activity translations
    RoleAssigned: "Rôle Attribué",
    RoleRevoked: "Rôle Révoqué",
    SystemUpgrade: "Mise à Niveau du Système",

    // Alert translations
    UnusualAPIActivity: "Activité API Inhabituelle",
    DetectedhighvolumeofAPIrequestsfromIP192: "Volume élevé de requêtes API détecté depuis l'IP 192.168.1.45",
    DatabaseBackupScheduled: "Sauvegarde de Base de Données Programmée",
    Automaticbackupscheduledfortonightat02: "Sauvegarde automatique programmée pour ce soir à 02:00 UTC",
    NodeSynchronizationIssue: "Problème de Synchronisation de Nœud",
    Blockchainnode: "Le nœud blockchain #5 est désynchronisé. Resynchronisation automatique initiée.",
  },

  de: {
    // Navigation
    dashboard: "Übersicht",
    profile: "Profil",
    notifications: "Benachrichtigungen",
    settings: "Einstellungen",
    help: "Hilfezentrum",
    logout: "Abmelden",

    // Roles
    admin: "Administrator",
    manufacturer: "Hersteller",
    distributor: "Distributor",
    regulator: "Regulator",
    public: "Öffentlich",

    // Common
    search: "Suchen...",
    viewAll: "Alle anzeigen",
    save: "Speichern",
    cancel: "Abbrechen",
    refresh: "Aktualisieren",
    loading: "Laden...",

    // Settings
    languageSettings: "Spracheinstellungen",
    interfaceLanguage: "Oberflächensprache",
    autoDetectLanguage: "Sprache automatisch erkennen",
    saveLanguagePreferences: "Spracheinstellungen speichern",

    // Languages
    english: "Englisch",
    spanish: "Spanisch",
    french: "Französisch",
    german: "Deutsch",
    chinese: "Chinesisch",

    // Admin Dashboard
    adminDashboard: "Admin-Dashboard",
    adminDashboardDescription: "Systemrollen verwalten und Plattformaktivität überwachen",
    refreshing: "Aktualisiere...",
    refreshData: "Daten aktualisieren",
    totalUsers: "Gesamtbenutzer",
    targetReached: "70% des Ziels erreicht",
    pendingApprovals: "Ausstehende Genehmigungen",
    needsAttention: "Benötigt Aufmerksamkeit",
    awaitingReview: "Wartet auf Überprüfung durch Admin",
    systemLoad: "Systemlast",
    live: "Live",
    systemPerformanceNormal: "Systemleistung normal",
    activeEntities: "Aktive Entitäten",
    systemAnalytics: "Systemanalyse",
    daily: "Täglich",
    weekly: "Wöchentlich",
    monthly: "Monatlich",
    userGrowthTrend: "Benutzerwachstumstrend",
    systemPerformanceMetrics: "Systemleistungsmetriken",
    systemStatus: "Systemstatus",
    userDistribution: "Benutzerverteilung",
    systemMetrics: "Systemmetriken",
    uptime: "Betriebszeit",
    apiRequestsToday: "API-Anfragen (heute)",
    databaseSize: "Datenbankgröße",
    lastBackup: "Letztes Backup",
    activeBlockchainNodes: "Aktive Blockchain-Knoten",
    viewSystemHealth: "Systemzustand anzeigen",
    databaseManagement: "Datenbankverwaltung",
    recentActivity: "Neueste Aktivität",
    systemAlerts: "Systemwarnungen",
    active: "aktiv",
    manageAlertSettings: "Warnungseinstellungen verwalten",
    quickActions: "Schnellaktionen",
    manageRoles: "Rollen verwalten",
    systemUpgrades: "Systemupgrades",
    viewAuditLogs: "Audit-Logs anzeigen",
    backupSystem: "System sichern",

    // Admin Navigation
    roleManagement: "Rollenverwaltung",
    analytics: "Analytik",
    database: "Datenbank",

    // Admin Sections
    administration: "Administration",
    manufacturing: "Herstellung",
    regulation: "Regulierung",
    distribution: "Vertrieb",
    publicAccess: "Öffentlicher Zugang",
    resources: "Ressourcen",
    general: "Allgemein",

    // Chart Labels
    userGrowth: "Benutzerwachstum",
    manufacturers: "Hersteller",
    distributors: "Distributoren",
    regulators: "Regulatoren",
    admins: "Administratoren",
    apiRequests: "API-Anfragen (K)",
    databaseQueries: "Datenbankabfragen (K)",
    blockchainOps: "Blockchain-Operationen (K)",

    // Manufacturer
    registerProduct: "Produkt registrieren",
    myProducts: "Meine Produkte",

    // Regulator
    issueTracker: "Problemverfolgung",
    auditTrail: "Prüfpfad",

    // Distributor
    shipmentTracking: "Sendungsverfolgung",

    // Public
    reportIssue: "Problem melden",
    searchProducts: "Produkte suchen",
    faq: "FAQ",

    // Notifications
    loggedOutSuccessfully: "Erfolgreich abgemeldet",
    loggedOutDescription: "Sie wurden sicher von Ihrem Konto abgemeldet.",

    // Activity translations
    RoleAssigned: "Rolle zugewiesen",
    RoleRevoked: "Rolle entzogen",
    SystemUpgrade: "Systemupgrade",

    // Alert translations
    UnusualAPIActivity: "Ungewöhnliche API-Aktivität",
    DetectedhighvolumeofAPIrequestsfromIP192: "Hohes Volumen von API-Anfragen von IP 192.168.1.45 erkannt",
    DatabaseBackupScheduled: "Datenbank-Backup geplant",
    Automaticbackupscheduledfortonightat02: "Automatisches Backup für heute Nacht um 02:00 UTC geplant",
    NodeSynchronizationIssue: "Knotensynchronisierungsproblem",
    Blockchainnode: "Blockchain-Knoten #5 ist nicht synchronisiert. Automatische Neusynchronisierung eingeleitet.",
  },

  zh: {
    // Navigation
    dashboard: "仪表板",
    profile: "个人资料",
    notifications: "通知",
    settings: "设置",
    help: "帮助中心",
    logout: "登出",

    // Roles
    admin: "管理员",
    manufacturer: "制造商",
    distributor: "分销商",
    regulator: "监管者",
    public: "公众",

    // Common
    search: "搜索...",
    viewAll: "查看全部",
    save: "保存",
    cancel: "取消",
    refresh: "刷新",
    loading: "加载中...",

    // Settings
    languageSettings: "语言设置",
    interfaceLanguage: "界面语言",
    autoDetectLanguage: "自动检测语言",
    saveLanguagePreferences: "保存语言偏好",

    // Languages
    english: "英语",
    spanish: "西班牙语",
    french: "法语",
    german: "德语",
    chinese: "中文",

    // Admin Dashboard
    adminDashboard: "管理员仪表板",
    adminDashboardDescription: "管理系统角色和监控平台活动",
    refreshing: "刷新中...",
    refreshData: "刷新数据",
    totalUsers: "总用户数",
    targetReached: "已达目标的70%",
    pendingApprovals: "待批准",
    needsAttention: "需要关注",
    awaitingReview: "等待管理员审核",
    systemLoad: "系统负载",
    live: "实时",
    systemPerformanceNormal: "系统性能正常",
    activeEntities: "活跃实体",
    systemAnalytics: "系统分析",
    daily: "每日",
    weekly: "每周",
    monthly: "每月",
    userGrowthTrend: "用户增长趋势",
    systemPerformanceMetrics: "系统性能指标",
    systemStatus: "系统状态",
    userDistribution: "用户分布",
    systemMetrics: "系统指标",
    uptime: "运行时间",
    apiRequestsToday: "API请求（今日）",
    databaseSize: "数据库大小",
    lastBackup: "上次备份",
    activeBlockchainNodes: "活跃区块链节点",
    viewSystemHealth: "查看系统健康状况",
    databaseManagement: "数据库管理",
    recentActivity: "最近活动",
    systemAlerts: "系统警报",
    active: "活跃",
    manageAlertSettings: "管理警报设置",
    quickActions: "快速操作",
    manageRoles: "管理角色",
    systemUpgrades: "系统升级",
    viewAuditLogs: "查看审计日志",
    backupSystem: "备份系统",

    // Admin Navigation
    roleManagement: "角色管理",
    analytics: "分析",
    database: "数据库",

    // Admin Sections
    administration: "管理",
    manufacturing: "制造",
    regulation: "监管",
    distribution: "分销",
    publicAccess: "公共访问",
    resources: "资源",
    general: "通用",

    // Chart Labels
    userGrowth: "用户增长",
    manufacturers: "制造商",
    distributors: "分销商",
    regulators: "监管者",
    admins: "管理员",
    apiRequests: "API请求（千）",
    databaseQueries: "数据库查询（千）",
    blockchainOps: "区块链操作（千）",

    // Manufacturer
    registerProduct: "注册产品",
    myProducts: "我的产品",

    // Regulator
    issueTracker: "问题跟踪",
    auditTrail: "审计跟踪",

    // Distributor
    shipmentTracking: "货物跟踪",

    // Public
    reportIssue: "报告问题",
    searchProducts: "搜索产品",
    faq: "常见问题",

    // Notifications
    loggedOutSuccessfully: "成功登出",
    loggedOutDescription: "您已安全登出您的账户。",

    // Activity translations
    RoleAssigned: "角色已分配",
    RoleRevoked: "角色已撤销",
    SystemUpgrade: "系统升级",

    // Alert translations
    UnusualAPIActivity: "异常API活动",
    DetectedhighvolumeofAPIrequestsfromIP192: "检测到来自IP 192.168.1.45的大量API请求",
    DatabaseBackupScheduled: "数据库备份已计划",
    Automaticbackupscheduledfortonightat02: "自动备份计划于今晚02:00 UTC进行",
    NodeSynchronizationIssue: "节点同步问题",
    Blockchainnode: "区块链节点#5不同步。自动重新同步已启动。",
  },
}

// Language context type definition
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  autoDetect: boolean
  setAutoDetect: (autoDetect: boolean) => void
  availableLanguages: Record<Language, string>
}

// Create language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language provider props
interface LanguageProviderProps {
  children: ReactNode
}

// Default language options
export const availableLanguages: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
}

// Language provider component
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en")
  const [autoDetect, setAutoDetect] = useState(true)
  const router = useRouter()

  // Get user's browser language
  const detectLanguage = (): Language => {
    if (typeof window !== "undefined") {
      const browserLang = navigator.language.split("-")[0]

      // Check if browser language is supported
      if (browserLang in availableLanguages) {
        return browserLang as Language
      }
    }
    return "en" // Default to English
  }

  // Set language and persist to cookies
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setCookie("preferred-language", lang, { maxAge: 60 * 60 * 24 * 365 }) // 1 year
    setAutoDetect(false)
    setCookie("auto-detect-language", "false", { maxAge: 60 * 60 * 24 * 365 })
  }

  // Update auto detect setting
  const updateAutoDetect = (value: boolean) => {
    setAutoDetect(value)
    setCookie("auto-detect-language", value.toString(), { maxAge: 60 * 60 * 24 * 365 })

    if (value) {
      const detectedLang = detectLanguage()
      setLanguageState(detectedLang)
      setCookie("preferred-language", detectedLang, { maxAge: 60 * 60 * 24 * 365 })
    }
  }

  // Load language preference on mount
  useEffect(() => {
    const savedAutoDetect = getCookie("auto-detect-language")
    const shouldAutoDetect = savedAutoDetect === undefined ? true : savedAutoDetect === "true"

    setAutoDetect(shouldAutoDetect)

    if (shouldAutoDetect) {
      setLanguageState(detectLanguage())
    } else {
      const savedLang = getCookie("preferred-language") as Language | undefined
      setLanguageState(savedLang || "en")
    }
  }, [])

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        autoDetect,
        setAutoDetect: updateAutoDetect,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}
