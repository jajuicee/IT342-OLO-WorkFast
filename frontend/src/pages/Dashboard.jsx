import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    // Get real user data from localStorage (set during login)
    const user = {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || ''
    };

    // Get first letter for avatar
    const avatarLetter = user.name.charAt(0).toUpperCase();

    // Mock active projects data
    const activeProjects = [
        {
            id: 1,
            name: 'Website Redesign',
            department: 'Design',
            progress: 75,
            dueDate: '2026-03-15',
            status: 'On Track',
            team: ['JD', 'AS', 'MK'],
            priority: 'High'
        },
        {
            id: 2,
            name: 'Mobile App Development',
            department: 'Engineering',
            progress: 45,
            dueDate: '2026-04-20',
            status: 'In Progress',
            team: ['RG', 'LM', 'TP', 'NK'],
            priority: 'High'
        },
        {
            id: 3,
            name: 'Marketing Campaign Q2',
            department: 'Marketing',
            progress: 60,
            dueDate: '2026-03-30',
            status: 'On Track',
            team: ['SC', 'BW'],
            priority: 'Medium'
        },
        {
            id: 4,
            name: 'Database Migration',
            department: 'Engineering',
            progress: 30,
            dueDate: '2026-05-10',
            status: 'At Risk',
            team: ['JD', 'VM', 'KL'],
            priority: 'High'
        },
        {
            id: 5,
            name: 'Customer Portal v2',
            department: 'Product',
            progress: 85,
            dueDate: '2026-03-12',
            status: 'On Track',
            team: ['DF', 'HJ', 'QR'],
            priority: 'Medium'
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow: hidden;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes progressFill {
          from { width: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .project-card {
          animation: slideIn 0.4s ease-out backwards;
        }
        
        .project-card:nth-child(1) { animation-delay: 0.1s; }
        .project-card:nth-child(2) { animation-delay: 0.15s; }
        .project-card:nth-child(3) { animation-delay: 0.2s; }
        .project-card:nth-child(4) { animation-delay: 0.25s; }
        .project-card:nth-child(5) { animation-delay: 0.3s; }
        
        .progress-bar {
          animation: progressFill 1s ease-out;
        }
      `}</style>

            <div style={styles.container}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <div style={styles.logoIcon}>
                            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                                <path d="M8 8L24 24L40 8M24 24L8 40M24 24L40 40" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="2.5" fill="none" opacity="0.3" />
                            </svg>
                        </div>
                        <h1 style={styles.logoText}>WorkFast</h1>
                    </div>

                    <nav style={styles.nav}>
                        <button
                            style={activeTab === 'dashboard' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={styles.navIcon}>
                                <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <span>Dashboard</span>
                        </button>

                        <button
                            style={activeTab === 'projects' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}
                            onClick={() => setActiveTab('projects')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={styles.navIcon}>
                                <rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M7 4V2M13 4V2M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span>Projects</span>
                        </button>

                        <button
                            style={activeTab === 'departments' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}
                            onClick={() => setActiveTab('departments')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={styles.navIcon}>
                                <path d="M3 7v10a1 1 0 001 1h12a1 1 0 001-1V7M3 7l7-4 7 4M3 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M10 17v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span>Departments</span>
                        </button>
                    </nav>

                    <div style={styles.sidebarFooter}>
                        <button style={styles.logoutButton} onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                <path d="M13 3h3a1 1 0 011 1v12a1 1 0 01-1 1h-3M7 14l-4-4m0 0l4-4m-4 4h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={styles.mainContent}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <h2 style={styles.pageTitle}>Active Projects</h2>
                            <p style={styles.pageSubtitle}>Track and manage your ongoing work</p>
                        </div>

                        {/* User Profile */}
                        <div style={styles.userSection}>
                            <div style={styles.userInfo}>
                                <div style={styles.userName}>{user.name}</div>
                                <div style={styles.userEmail}>{user.email}</div>
                            </div>
                            <div style={styles.userAvatar}>
                                {avatarLetter}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>Active Projects</div>
                                <div style={styles.statValue}>{activeProjects.length}</div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>On Track</div>
                                <div style={styles.statValue}>{activeProjects.filter(p => p.status === 'On Track').length}</div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon} style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>In Progress</div>
                                <div style={styles.statValue}>{activeProjects.filter(p => p.status === 'In Progress').length}</div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon} style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>At Risk</div>
                                <div style={styles.statValue}>{activeProjects.filter(p => p.status === 'At Risk').length}</div>
                            </div>
                        </div>
                    </div>

                    {/* Projects List */}
                    <div style={styles.projectsContainer}>
                        {activeProjects.map((project, index) => (
                            <div key={project.id} className="project-card" style={styles.projectCard}>
                                <div style={styles.projectHeader}>
                                    <div style={styles.projectLeft}>
                                        <h3 style={styles.projectName}>{project.name}</h3>
                                        <div style={styles.projectMeta}>
                                            <span style={styles.department}>
                                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ marginRight: '4px' }}>
                                                    <path d="M3 7v10a1 1 0 001 1h12a1 1 0 001-1V7M3 7l7-4 7 4M3 7h14" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                                {project.department}
                                            </span>
                                            <span style={styles.dueDate}>
                                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ marginRight: '4px' }}>
                                                    <rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M7 4V2M13 4V2M3 8h14" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                                Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={styles.projectRight}>
                                        <span style={
                                            project.priority === 'High' ? { ...styles.badge, ...styles.badgeHigh } :
                                                project.priority === 'Medium' ? { ...styles.badge, ...styles.badgeMedium } :
                                                    { ...styles.badge, ...styles.badgeLow }
                                        }>
                                            {project.priority}
                                        </span>
                                        <span style={
                                            project.status === 'On Track' ? { ...styles.statusBadge, ...styles.statusOnTrack } :
                                                project.status === 'In Progress' ? { ...styles.statusBadge, ...styles.statusInProgress } :
                                                    { ...styles.statusBadge, ...styles.statusAtRisk }
                                        }>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.progressSection}>
                                    <div style={styles.progressHeader}>
                                        <span style={styles.progressLabel}>Progress</span>
                                        <span style={styles.progressValue}>{project.progress}%</span>
                                    </div>
                                    <div style={styles.progressBar}>
                                        <div style={{
                                            ...styles.progressFill,
                                            width: `${project.progress}%`,
                                            background: project.progress >= 70 ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)' :
                                                project.progress >= 40 ? 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)' :
                                                    'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'
                                        }} className="progress-bar"></div>
                                    </div>
                                </div>

                                <div style={styles.projectFooter}>
                                    <div style={styles.teamAvatars}>
                                        {project.team.map((member, idx) => (
                                            <div key={idx} style={{
                                                ...styles.teamAvatar,
                                                marginLeft: idx > 0 ? '-8px' : '0',
                                                zIndex: project.team.length - idx
                                            }}>
                                                {member}
                                            </div>
                                        ))}
                                        <span style={styles.teamCount}>Team of {project.team.length}</span>
                                    </div>

                                    <button style={styles.viewButton}>
                                        View Details
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                            <path d="M5 10h10M12 7l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        fontFamily: "'Manrope', sans-serif",
        overflow: 'hidden',
        background: '#F8FAFC',
    },

    // SIDEBAR STYLES
    sidebar: {
        width: '280px',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
    },

    sidebarHeader: {
        padding: '32px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },

    logoIcon: {
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
    },

    logoText: {
        fontSize: '24px',
        fontWeight: '800',
        color: 'white',
        letterSpacing: '-0.02em',
    },

    nav: {
        flex: 1,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },

    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: 'transparent',
        border: 'none',
        borderRadius: '10px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Manrope', sans-serif",
        textAlign: 'left',
    },

    navItemActive: {
        background: 'rgba(59, 130, 246, 0.15)',
        color: 'white',
        boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)',
    },

    navIcon: {
        minWidth: '20px',
    },

    sidebarFooter: {
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },

    logoutButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '10px',
        color: '#FCA5A5',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
        fontFamily: "'Manrope', sans-serif",
    },

    // MAIN CONTENT STYLES
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 40px',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
    },

    headerLeft: {
        flex: 1,
    },

    pageTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: '4px',
        letterSpacing: '-0.02em',
    },

    pageSubtitle: {
        fontSize: '15px',
        color: '#64748B',
    },

    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },

    userInfo: {
        textAlign: 'right',
    },

    userName: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: '2px',
    },

    userEmail: {
        fontSize: '13px',
        color: '#64748B',
    },

    userAvatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '700',
        color: 'white',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },

    // STATS GRID
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        padding: '24px 40px',
    },

    statCard: {
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },

    statIcon: {
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '56px',
    },

    statContent: {
        flex: 1,
    },

    statLabel: {
        fontSize: '13px',
        color: '#64748B',
        fontWeight: '600',
        marginBottom: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },

    statValue: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#0F172A',
        fontFamily: "'Fira Code', monospace",
    },

    // PROJECTS CONTAINER
    projectsContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 40px 40px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },

    projectCard: {
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
    },

    projectHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
    },

    projectLeft: {
        flex: 1,
    },

    projectName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: '8px',
        letterSpacing: '-0.01em',
    },

    projectMeta: {
        display: 'flex',
        gap: '16px',
        fontSize: '13px',
        color: '#64748B',
    },

    department: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '600',
    },

    dueDate: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
    },

    projectRight: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },

    badge: {
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },

    badgeHigh: {
        background: '#FEE2E2',
        color: '#991B1B',
    },

    badgeMedium: {
        background: '#FEF3C7',
        color: '#92400E',
    },

    badgeLow: {
        background: '#DBEAFE',
        color: '#1E40AF',
    },

    statusBadge: {
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700',
    },

    statusOnTrack: {
        background: '#D1FAE5',
        color: '#065F46',
    },

    statusInProgress: {
        background: '#DBEAFE',
        color: '#1E40AF',
    },

    statusAtRisk: {
        background: '#FEE2E2',
        color: '#991B1B',
    },

    progressSection: {
        marginBottom: '20px',
    },

    progressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },

    progressLabel: {
        fontSize: '13px',
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },

    progressValue: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#0F172A',
        fontFamily: "'Fira Code', monospace",
    },

    progressBar: {
        height: '8px',
        background: '#E2E8F0',
        borderRadius: '100px',
        overflow: 'hidden',
        position: 'relative',
    },

    progressFill: {
        height: '100%',
        borderRadius: '100px',
        transition: 'width 0.3s ease',
    },

    projectFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    teamAvatars: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },

    teamAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        color: 'white',
        border: '2px solid white',
    },

    teamCount: {
        fontSize: '13px',
        color: '#64748B',
        fontWeight: '600',
    },

    viewButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 18px',
        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Manrope', sans-serif",
    },
};

// Add hover effects
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .nav-item:hover:not(.nav-item-active) {
      background: rgba(255, 255, 255, 0.05) !important;
      color: rgba(255, 255, 255, 0.9) !important;
    }
    
    .logout-button:hover {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: rgba(239, 68, 68, 0.4) !important;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
      border-color: #CBD5E1 !important;
    }
    
    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1) !important;
      border-color: #CBD5E1 !important;
    }
    
    .view-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
    }
    
    .view-button:active {
      transform: translateY(0);
    }
  `;
    document.head.appendChild(styleSheet);
}

export default Dashboard;