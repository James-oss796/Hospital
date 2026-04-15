import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { patientApi, departmentApi, wardApi, auditApi, appointmentApi, doctorApi } from '../services/api';

export type PatientStatus = 'queued' | 'in-progress' | 'served' | 'admitted';
export type AppointmentStatus = 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
export type DoctorStatus = 'available' | 'in-surgery' | 'on-call' | 'off-duty';
export type Priority = 'standard' | 'urgent' | 'emergency';

export interface Vitals {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    weight?: number;
    recordedAt: string;
}

export interface Prescription {
    id: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    prescribedAt: string;
    prescribedBy: string;
}

export interface Referral {
    id: string;
    toSpecialty: string;
    reason: string;
    urgency: 'routine' | 'urgent' | 'emergency';
    referredAt: string;
    referredBy: string;
}

export interface Patient {
    id: string;
    tokenId: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    phone: string;
    nationalId: string;
    reason: string;
    assignedDoctor?: string;
    status: PatientStatus;
    registeredAt: string;
    servedAt?: string;
    diagnosis?: string;
    consultationNotes?: string;
    department: string;
    priority: Priority;
    vitals?: Vitals[];
    prescriptions?: Prescription[];
    referrals?: Referral[];
}

export interface Appointment {
    id: string;
    patientName: string;
    patientId?: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    type: 'scheduled' | 'walk-in' | 'follow-up';
    status: AppointmentStatus;
    notes?: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    station: string;
    shift: string;
    status: DoctorStatus;
    patientsSeenToday: number;
    phone: string;
    email: string;
    departmentId: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    reorderLevel: number;
    lastUpdated: string;
    supplier: string;
}

export interface Department {
    id: number;
    name: string;
}

export const getInventoryStatus = (item: InventoryItem): 'in-stock' | 'low-stock' | 'out-of-stock' => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.reorderLevel) return 'low-stock';
    return 'in-stock';
};

export interface Bed {
    id: number | string;
    bedNumber: string;
    status: 'available' | 'occupied' | 'maintenance';
    patientId?: string;
    patientName?: string;
    admittedAt?: string;
}

export interface Ward {
    id: number | string;
    name: string;
    department: string;
    type: 'general' | 'icu' | 'maternity' | 'surgical' | 'hdu';
    capacity: number;
    beds?: Bed[];
}

export interface AuditLog {
    id: number;
    actorUsername: string;
    actorRole: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    timestamp: string;
}

interface DataContextType {
    patients: Patient[];
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    doctors: Doctor[];
    setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
    departments: Department[];
    setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
    wards: Ward[];
    setWards: React.Dispatch<React.SetStateAction<Ward[]>>;
    inventory: InventoryItem[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    auditLogs: AuditLog[];
    setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
    addPatient: (data: Omit<Patient, 'id' | 'tokenId' | 'registeredAt'>) => Promise<Patient>;
    updatePatientStatus: (id: string, status: PatientStatus, extra?: Partial<Patient>) => Promise<void>;
    addAppointment: (data: Omit<Appointment, 'id'>) => Promise<void>;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
    addPrescription: (patientId: string, prescription: Omit<Prescription, 'id' | 'prescribedAt'>) => void;
    addReferral: (patientId: string, referral: Omit<Referral, 'id' | 'referredAt'>) => void;
    updateVitals: (patientId: string, vitals: Omit<Vitals, 'recordedAt'>) => void;
    getDepartmentStats: () => Record<string, number>;
    addDepartment: (name: string) => Promise<void>;
    deleteDepartment: (id: number) => Promise<void>;
    fetchWards: () => Promise<void>;
    fetchAuditLogs: () => Promise<void>;
    isAssignedToBed: (patientId: string) => boolean;
    ready: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [ready, setReady] = useState(false);
    const { notify } = useNotification();
    const { user, isAuthenticated } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await departmentApi.getAll();
            setDepartments(response.data);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
        }
    }, []);

    const fetchWards = useCallback(async () => {
        try {
            const response = await wardApi.getAll();
            setWards(response.data);
        } catch (error) {
            console.error("Failed to fetch wards:", error);
        }
    }, []);

    const fetchDoctors = useCallback(async () => {
        try {
            const response = await doctorApi.getAll();
            setDoctors(response.data);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        }
    }, []);

    const fetchAuditLogs = useCallback(async () => {
        if (!isAdmin) return; // Only admins can access audit logs
        try {
            const response = await auditApi.getAll();
            setAuditLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        }
    }, [isAdmin]);

    useEffect(() => {
        if (!isAuthenticated) {
            // Clear data state on logout
            setPatients([]);
            setAppointments([]);
            setDoctors([]);
            setDepartments([]);
            setWards([]);
            setInventory([]);
            setAuditLogs([]);
            setReady(false);
            return;
        }

        const fetchInitialData = async () => {
            try {
                await Promise.all([
                    fetchDepartments(),
                    fetchWards(),
                    fetchAuditLogs(),
                    fetchDoctors()
                ]);

                const response = await patientApi.getAll();
                const backendPatients = response.data.map((p: any) => ({
                    ...p,
                    id: String(p.id)
                }));
                
                if (backendPatients.length > 0) {
                    setPatients(backendPatients);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                // Don't notify on 401/403 if we're not authenticated (though guard should prevent this)
                if (isAuthenticated) {
                    notify('Could not connect to health server. Please check your connection.', 'error', 'Connection Error');
                }
            }
            setReady(true);
        };

        fetchInitialData();
    }, [isAuthenticated, notify, fetchDepartments, fetchWards, fetchAuditLogs]);


    const addPatient = useCallback(async (data: Omit<Patient, 'id' | 'tokenId' | 'registeredAt'>): Promise<Patient> => {
        try {
            const response = await patientApi.create(data);
            const newPatient: Patient = {
                ...response.data,
                id: String(response.data.id)
            };
            setPatients(prev => [...prev, newPatient]);
            notify(`Patient ${newPatient.name} registered successfully. Token: ${newPatient.tokenId}`, 'success', 'Patient Registered');
            return newPatient;
        } catch (error) {
            notify('Failed to register patient on server.', 'error', 'Server Error');
            throw error;
        }
    }, [notify]);

    const isAssignedToBed = useCallback((patientId: string) => {
        return wards.some(ward => 
            ward.beds?.some(bed => bed.patientId === patientId && bed.status === 'occupied')
        );
    }, [wards]);

    const updatePatientStatus = useCallback(async (id: string, status: PatientStatus, extra?: Partial<Patient>) => {
        try {
            // First update locally for immediate UX
            setPatients(prev => prev.map(p => p.id === id ? { ...p, status, ...extra } : p));
            
            // Sync with backend
            await patientApi.updateStatus(id, status);
            
            if (status === 'served') {
                notify('Consultation completed and record updated.', 'success', 'Session Ended');
            }
        } catch (error) {
            notify('Failed to update patient status on server.', 'error', 'Server Error');
        }
    }, [notify]);

    const addAppointment = useCallback(async (data: Omit<Appointment, 'id'>) => {
        try {
            const response = await appointmentApi.create(data);
            setAppointments(prev => [...prev, { ...response.data, id: String(response.data.id) }]);
            notify(`Appointment scheduled for ${data.patientName}.`, 'success', 'Appointment Created');
        } catch (error) {
            console.error("Failed to create appointment:", error);
            notify(`Failed to schedule appointment for ${data.patientName}.`, 'error', 'Server Error');
        }
    }, [notify]);

    const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }, []);

    const addPrescription = useCallback((patientId: string, rx: Omit<Prescription, 'id' | 'prescribedAt'>) => {
        const newRx: Prescription = {
            ...rx,
            id: Math.random().toString(36).substr(2, 9),
            prescribedAt: new Date().toISOString(),
        };
        setPatients(prev => prev.map(p => 
            p.id === patientId 
                ? { ...p, prescriptions: [...(p.prescriptions || []), newRx] } 
                : p
        ));
        notify(`Prescribed ${newRx.medicineName} to patient.`, 'success', 'Prescription Added');
    }, [notify]);

    const addReferral = useCallback((patientId: string, ref: Omit<Referral, 'id' | 'referredAt'>) => {
        const newRef: Referral = {
            ...ref,
            id: Math.random().toString(36).substr(2, 9),
            referredAt: new Date().toISOString(),
        };
        setPatients(prev => prev.map(p => 
            p.id === patientId 
                ? { ...p, referrals: [...(p.referrals || []), newRef] } 
                : p
        ));
        notify(`Referral to ${newRef.toSpecialty} generated.`, 'info', 'Specialist Referral');
    }, [notify]);

    const updateVitals = useCallback((patientId: string, v: Omit<Vitals, 'recordedAt'>) => {
        const newVitals: Vitals = {
            ...v,
            recordedAt: new Date().toISOString(),
        };
        setPatients(prev => prev.map(p => 
            p.id === patientId 
                ? { ...p, vitals: [...(p.vitals || []), newVitals] } 
                : p
        ));
        notify('Vitals updated successfully.', 'success', 'Vitals Recorded');
    }, [notify]);

    const getDepartmentStats = useCallback(() => {
        const stats: Record<string, number> = {};
        patients.filter(p => p.status === 'queued' || p.status === 'in-progress').forEach(p => {
            stats[p.department] = (stats[p.department] || 0) + 1;
        });
        return stats;
    }, [patients]);

    const addDepartment = useCallback(async (name: string) => {
        try {
            const response = await departmentApi.create({ name });
            setDepartments(prev => [...prev, response.data]);
            notify(`Department ${name} added successfully.`, 'success', 'Department Added');
        } catch (error) {
            notify('Failed to add department.', 'error', 'Server Error');
        }
    }, [notify]);

    const deleteDepartment = useCallback(async (id: number) => {
        try {
            await departmentApi.delete(id);
            setDepartments(prev => prev.filter(d => d.id !== id));
            notify('Department removed successfully.', 'success', 'Department Deleted');
        } catch (error) {
            notify('Failed to delete department.', 'error', 'Server Error');
        }
    }, [notify]);

    return (
        <DataContext.Provider value={{
            patients,
            setPatients,
            appointments,
            setAppointments,
            doctors,
            setDoctors,
            departments,
            setDepartments,
            wards,
            setWards,
            inventory,
            setInventory,
            auditLogs,
            setAuditLogs,
            addPatient,
            updatePatientStatus,
            addAppointment,
            updateAppointmentStatus,
            addPrescription,
            addReferral,
            updateVitals,
            getDepartmentStats,
            addDepartment,
            deleteDepartment,
            fetchWards,
            fetchAuditLogs,
            isAssignedToBed,
            ready
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be within DataProvider');
    return ctx;
};