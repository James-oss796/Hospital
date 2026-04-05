import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import DashboardCard from '../ui/DashboardCard';
import SignatureButton from '../ui/SignatureButton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportModalProps {
    onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose }) => {
    const { patients, appointments, doctors, inventory } = useData();
    const [reportType, setReportType] = useState('patients');
    const [dateRange, setDateRange] = useState('today');

    const getReportData = () => {
        switch (reportType) {
            case 'patients':
                return {
                    title: 'Patient Report',
                    data: patients,
                    stats: [
                        { label: 'Total Registered', value: patients.length, icon: 'group', color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'In Queue', value: patients.filter(p => p.status === 'queued').length, icon: 'hourglass_empty', color: 'text-warning', bg: 'bg-warning/10' },
                        { label: 'In Progress', value: patients.filter(p => p.status === 'in-progress').length, icon: 'medical_services', color: 'text-info', bg: 'bg-info/10' },
                        { label: 'Admitted', value: patients.filter(p => p.status === 'admitted').length, icon: 'local_hospital', color: 'text-error', bg: 'bg-error/10' },
                    ]
                };
            case 'appointments':
                return {
                    title: 'Appointment Report',
                    data: appointments,
                    stats: [
                        { label: 'Total Appointments', value: appointments.length, icon: 'calendar_today', color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: 'check_circle', color: 'text-success', bg: 'bg-success/10' },
                        { label: 'Upcoming', value: appointments.filter(a => a.status === 'upcoming').length, icon: 'schedule', color: 'text-warning', bg: 'bg-warning/10' },
                        { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, icon: 'cancel', color: 'text-error', bg: 'bg-error/10' },
                    ]
                };
            case 'doctors':
                return {
                    title: 'Doctor Report',
                    data: doctors,
                    stats: [
                        { label: 'Total Doctors', value: doctors.length, icon: 'badge', color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Available', value: doctors.filter(d => d.status === 'available').length, icon: 'check_circle', color: 'text-success', bg: 'bg-success/10' },
                        { label: 'On Call', value: doctors.filter(d => d.status === 'on-call').length, icon: 'phone', color: 'text-warning', bg: 'bg-warning/10' },
                        { label: 'In Surgery', value: doctors.filter(d => d.status === 'in-surgery').length, icon: 'surgical', color: 'text-error', bg: 'bg-error/10' },
                    ]
                };
            case 'inventory':
                return {
                    title: 'Inventory Report',
                    data: inventory,
                    stats: [
                        { label: 'Total Items', value: inventory.length, icon: 'inventory_2', color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Low Stock', value: inventory.filter(i => i.quantity <= i.reorderLevel && i.quantity > 0).length, icon: 'warning', color: 'text-warning', bg: 'bg-warning/10' },
                        { label: 'Out of Stock', value: inventory.filter(i => i.quantity === 0).length, icon: 'error', color: 'text-error', bg: 'bg-error/10' },
                        { label: 'In Stock', value: inventory.filter(i => i.quantity > i.reorderLevel).length, icon: 'check', color: 'text-success', bg: 'bg-success/10' },
                    ]
                };
            default:
                return { title: 'Report', data: [], stats: [] };
        }
    };

    const generateReport = () => {
        const reportData = getReportData();
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(15, 78, 63); // Signature primary color
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("Afyaflow Medical System", 15, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 30);
        doc.text(`Period: ${dateRange.toUpperCase()}`, 15, 35);

        // Title
        doc.setTextColor(15, 78, 63);
        doc.setFontSize(18);
        doc.text(reportData.title, 15, 55);

        // Stats Summary
        let y = 70;
        reportData.stats.forEach((stat) => {
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(stat.label, 15, y);
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text(String(stat.value), 15, y + 5);
            y += 15;
        });

        // Data Table
        if (reportData.data.length > 0) {
            const headers = Object.keys(reportData.data[0]).slice(0, 6);
            const rows = reportData.data.map(item => 
                headers.map(header => {
                    const val = (item as any)[header];
                    return typeof val === 'object' ? '...' : String(val);
                })
            );

            autoTable(doc, {
                startY: y + 10,
                head: [headers.map(h => h.toUpperCase())],
                body: rows,
                theme: 'striped',
                headStyles: { fillStyle: 'F', fillColor: [15, 78, 63] },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });
        }

        doc.save(`${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
        onClose();
    };

    const reportData = getReportData();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <DashboardCard noPadding className="flex-1 flex flex-col shadow-2xl border-outline-variant/20 bg-white">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full signature-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-2xl">analytics</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-primary tracking-tight">Generate Report</h2>
                                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Export custom data analytics and system snapshots</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors text-on-surface-variant"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* Config Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest pl-1">Data Source</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['patients', 'appointments', 'doctors', 'inventory'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setReportType(type)}
                                            className={`px-4 py-3 rounded-xl capitalize transition-all font-bold text-sm border-2 ${
                                                reportType === type
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-outline-variant/20 bg-white text-on-surface hover:border-primary/30'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest pl-1">Time Period</label>
                                <div className="relative">
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-xl outline-none appearance-none font-bold text-on-surface cursor-pointer transition-all"
                                    >
                                        <option value="today">Today's Activity</option>
                                        <option value="week">Past 7 Days</option>
                                        <option value="month">Past 30 Days</option>
                                        <option value="all">Lifetime History</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                Report Preview
                            </h3>
                            
                            {/* KPI Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {reportData.stats.map((stat, index) => (
                                    <div key={index} className="bg-white border border-outline-variant/10 rounded-2xl p-5 shadow-sm">
                                        <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                                            <span className="material-symbols-outlined text-[20px]">
                                                {stat.icon}
                                            </span>
                                        </div>
                                        <p className="text-3xl font-black text-on-surface tracking-tighter mb-1">{stat.value}</p>
                                        <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Data Table Snippet */}
                            <div className="rounded-xl border border-outline-variant/10 overflow-hidden bg-white">
                                <table className="w-full text-left">
                                    <thead className="bg-surface-container-low">
                                        <tr>
                                            {reportData.data.length > 0 && Object.keys(reportData.data[0]).slice(0, 4).map((key) => (
                                                <th key={key} className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {reportData.data.slice(0, 3).map((item: any, index: number) => (
                                            <tr key={index} className="hover:bg-primary/5 transition-colors">
                                                {Object.values(item).slice(0, 4).map((value: any, i: number) => (
                                                    <td key={i} className="px-5 py-4 text-xs font-medium text-on-surface">
                                                        {typeof value === 'object' ? JSON.stringify(value).slice(0, 30) : String(value).slice(0, 30)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {reportData.data.length === 0 && (
                                    <div className="p-8 text-center text-sm font-bold text-on-surface-variant">
                                        No data available for the selected parameters.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-6 border-t border-outline-variant/10 bg-surface-container-lowest flex justify-end gap-4">
                        <SignatureButton variant="clear" onClick={onClose}>
                            Cancel
                        </SignatureButton>
                        <SignatureButton icon="picture_as_pdf" onClick={generateReport}>
                            Download PDF
                        </SignatureButton>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default ReportModal;