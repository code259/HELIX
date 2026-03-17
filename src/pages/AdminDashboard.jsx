import React, { useState, useEffect } from 'react';
import {
    Activity,
    Cpu,
    Database,
    Terminal,
    Play,
    Square,
    RefreshCw,
    AlertCircle,
    Server,
    Zap
} from 'lucide-react';

export default function AdminDashboard() {
    const [isScriptRunning, setIsScriptRunning] = useState(false);
    const [logs, setLogs] = useState([
        { time: '09:25:01', type: 'info', msg: 'System initialized successfully.' },
        { time: '09:25:15', type: 'info', msg: 'Connecting to inference engine...' },
        { time: '09:25:30', type: 'success', msg: 'Database connection established (250k+ records).' },
        { time: '09:26:10', type: 'warning', msg: 'Latency spike detected in evaluation pipeline (1.2s).' }
    ]);

    const toggleScript = () => {
        setIsScriptRunning(!isScriptRunning);
        const newLog = {
            time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
            type: isScriptRunning ? 'warning' : 'info',
            msg: isScriptRunning ? 'Generative script stopped manually.' : 'Initiating LCG-VAE candidate generation script...'
        };
        setLogs(prev => [newLog, ...prev]);
    };

    return (
        <div className="container mt-8 animate-fade-in pb-16">
            <div className="flex justify-between items-end mb-8 border-b border-gray-100/10 pb-6 admin-header">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Server className="text-blue-500" size={32} />
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Real-time analytics and control interface for the HELIX discovery engine.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-secondary btn-sm gap-2">
                        <RefreshCw size={14} /> Refresh Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="CPU Usage" value="24%" icon={<Cpu size={20} />} trend="+2.4%" color="blue" />
                <StatCard title="RAM Occupancy" value="4.2 GB" icon={<Activity size={20} />} trend="-0.5%" color="emerald" />
                <StatCard title="Active Inferences" value="12/min" icon={<Zap size={20} />} trend="+4" color="amber" />
                <StatCard title="Database Health" value="Optimal" icon={<Database size={20} />} trend="99.9%" color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Script Control */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 border-t-2 border-primary">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Terminal size={18} className="text-primary" />
                            Engine Control
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-bg rounded-lg border border-border">
                                <div>
                                    <p className="text-sm font-medium">LCG-VAE Generator</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${isScriptRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                        <span className="text-xs text-gray-400">{isScriptRunning ? 'Running' : 'Idle'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleScript}
                                    className={`p-2 rounded-lg transition-all ${isScriptRunning ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'}`}
                                >
                                    {isScriptRunning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                </button>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-bg rounded-lg border border-border opacity-60">
                                <div>
                                    <p className="text-sm font-medium">ExtraTrees Scorer</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        <span className="text-xs text-gray-400">Stable</span>
                                    </div>
                                </div>
                                <button disabled className="p-2 rounded-lg bg-gray-500/20 text-gray-500 cursor-not-allowed">
                                    <Play size={20} fill="currentColor" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                            <div className="flex items-start gap-3 p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-xs leading-relaxed">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <p>Caution: Stopping the generator while batch processing may cause partial database inconsistentcies.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Logs */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-6 h-full flex flex-col">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Activity size={18} className="text-primary" />
                            System Diagnostics
                        </h3>

                        <div className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-sm overflow-y-auto min-h-[400px]">
                            {logs.map((log, i) => (
                                <div key={i} className="mb-2 flex gap-4 border-b border-white/5 pb-2 last:border-0">
                                    <span className="text-gray-500 shrink-0">[{log.time}]</span>
                                    <span className={`uppercase font-bold shrink-0 ${log.type === 'success' ? 'text-emerald-500' :
                                        log.type === 'warning' ? 'text-amber-500' :
                                            'text-blue-400'
                                        }`}>
                                        {log.type}
                                    </span>
                                    <span className="text-gray-300">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }) {
    const colorMap = {
        blue: 'text-blue-500 bg-blue-500/10',
        emerald: 'text-emerald-500 bg-emerald-500/10',
        amber: 'text-amber-500 bg-amber-500/10',
        indigo: 'text-indigo-500 bg-indigo-500/10'
    };

    return (
        <div className="glass-panel p-5 flex items-center gap-5 border-l-2 border-transparent hover:border-gray-500 transition-all">
            <div className={`p-3 rounded-xl ${colorMap[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-3">
                    <p className="text-2xl font-bold">{value}</p>
                    <span className={`text-xs ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend}
                    </span>
                </div>
            </div>
        </div>
    );
}
