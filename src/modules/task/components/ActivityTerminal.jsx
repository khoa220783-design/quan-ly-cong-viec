/**
 * @file ActivityTerminal.jsx
 * @description Real-time blockchain activity log with terminal aesthetic
 * Author: My - Commit My 6 (Extra)
 */

import React, { useState, useEffect, useRef } from 'react';
import { FaTerminal, FaCode, FaChevronRight, FaRegCircle } from 'react-icons/fa';
import { useContractContext } from '../../contract/ContractContext';

const ActivityTerminal = () => {
    const { contract } = useContractContext();
    const [logs, setLogs] = useState([
        { id: '1', type: 'system', text: 'Terminal initialized...', timestamp: new Date() },
        { id: '2', type: 'system', text: 'Listening for blockchain events...', timestamp: new Date() }
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        if (!contract) return;

        const addLog = (text, type = 'info') => {
            setLogs(prev => [
                ...prev.slice(-49), // Keep last 50 logs
                { id: Date.now().toString() + Math.random(), type, text, timestamp: new Date() }
            ]);
        };

        // Listen for events
        const onTaskCreated = (id, owner, title) => {
            addLog(`[TASK_CREATED] New task #${id.toString().slice(0, 4)}: "${title}" by ${owner.slice(0, 6)}...`, 'success');
        };

        const onTaskUpdated = (id, title) => {
            addLog(`[TASK_UPDATED] Task #${id.toString().slice(0, 4)}: "${title}" updated.`, 'info');
        };

        const onTaskCompleted = (id, completedBy) => {
            addLog(`[TASK_COMPLETED] Task #${id.toString().slice(0, 4)} marked as ${completedBy ? 'DONE' : 'PENDING'}.`, 'success');
        };

        contract.on('TaskCreated', onTaskCreated);
        contract.on('TaskUpdated', onTaskUpdated);
        contract.on('TaskCompleted', onTaskCompleted);

        return () => {
            contract.off('TaskCreated', onTaskCreated);
            contract.off('TaskUpdated', onTaskUpdated);
            contract.off('TaskCompleted', onTaskCompleted);
        };
    }, [contract]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="bg-black/95 border border-border rounded-xl overflow-hidden font-mono shadow-2xl flex flex-col h-[400px]">
            {/* Title bar */}
            <div className="bg-surface-elevated px-4 py-2 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs text-secondary ml-2 font-semibold tracking-wider">TERMINAL - ACTIVITY_LOG.SH</span>
                </div>
                <FaCode className="text-dim w-3.5 h-3.5" />
            </div>

            {/* Content */}
            <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-1.5 text-xs custom-scrollbar"
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 leading-relaxed group">
                        <span className="text-dim shrink-0">[{formatTime(log.timestamp)}]</span>
                        <span className={`
              ${log.type === 'success' ? 'text-neon-green' :
                                log.type === 'error' ? 'text-neon-red' :
                                    log.type === 'system' ? 'text-neon-cyan' : 'text-primary'}
            `}>
                            <span className="text-neon-green opacity-50 mr-2">$</span>
                            {log.text}
                        </span>
                    </div>
                ))}
                <div className="flex items-center gap-2 text-neon-green">
                    <span>$</span>
                    <span className="w-2 h-4 bg-neon-green animate-blink" />
                </div>
            </div>

            {/* Controls */}
            <div className="bg-surface-elevated/50 px-4 py-1.5 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-4 text-[10px] text-dim">
                    <span className="flex items-center gap-1">
                        <FaChevronRight className="w-2 h-2" /> SEPOLIA_NET
                    </span>
                    <span className="flex items-center gap-1">
                        <FaRegCircle className="w-2 h-2 text-neon-green fill-neon-green/30" /> CONNECTED
                    </span>
                </div>
                <button
                    onClick={() => setLogs([{ id: 'init', type: 'system', text: 'Log cleared...', timestamp: new Date() }])}
                    className="text-[10px] text-dim hover:text-white transition-colors"
                >
                    CLEAR
                </button>
            </div>
        </div>
    );
};

export default ActivityTerminal;
