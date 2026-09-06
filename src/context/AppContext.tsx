import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  MessFee,
  PaymentRecord,
  MenuItem,
  PickupSlot,
  MealOrder,
  NotificationItem,
  UpiSettings,
  MessConfig,
  OrderStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FEES,
  INITIAL_PAYMENTS,
  INITIAL_MENU,
  INITIAL_SLOTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_UPI_SETTINGS,
  INITIAL_CONFIG,
} from '../data/initialData';

export type AppView =
  | 'landing'
  | 'student-dashboard'
  | 'pre-order'
  | 'my-orders'
  | 'payment-history'
  | 'admin-dashboard';

export type AdminTab =
  | 'queue'
  | 'students'
  | 'fees'
  | 'menu'
  | 'slots'
  | 'upi'
  | 'reminders'
  | 'reports';

interface AppContextType {
  currentUser: User | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  login: (idOrEmail: string, role: 'student' | 'admin') => boolean;
  logout: () => void;
  switchUser: (user: User) => void;
  switchPersona: (role: 'student' | 'admin') => void;
  resetData: () => void;

  // Students & Users
  students: User[];
  allUsers: User[];
  addStudent: (student: Omit<User, 'id' | 'role'>) => void;

  // Fees & Payments
  fees: MessFee[];
  payments: PaymentRecord[];
  getStudentFee: (studentId?: string) => MessFee | undefined;
  payFee: (studentId: string, utrNumber: string, amount: number) => string;
  verifyPayment: (paymentId: string, approve: boolean) => void;
  updateMonthlyFeeConfig: (newFee: number, newDueDate: string) => void;

  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Slots
  slots: PickupSlot[];
  updateSlotCapacity: (slotId: string, newCapacity: number) => void;
  toggleSlotActive: (slotId: string) => void;

  // Orders
  orders: MealOrder[];
  createOrder: (orderData: {
    slotId: string;
    items: { menuItemId: string; name: string; quantity: number; price: number; imageEmoji?: string }[];
    specialInstructions?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner';
    date?: string;
  }) => MealOrder | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  sendBroadcastReminder: (targetStudentIds: string[], message: string, title?: string) => void;

  // UPI & Settings
  upiSettings: UpiSettings;
  updateUpiSettings: (settings: Partial<UpiSettings>) => void;
  messConfig: MessConfig;

  // Modals & Active actions
  activeTokenOrder: MealOrder | null;
  setActiveTokenOrder: (order: MealOrder | null) => void;
  isFeeModalOpen: boolean;
  setIsFeeModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getStorage<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(`smart_mess_${key}`);
    return saved ? JSON.parse(saved) : initial;
  } catch {
    return initial;
  }
}

function setStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`smart_mess_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStorage<User | null>('currentUser', null)
  );
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedUser = getStorage<User | null>('currentUser', null);
    if (!savedUser) return 'landing';
    return savedUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
  });
  const [adminTab, setAdminTab] = useState<AdminTab>('queue');

  const [allUsers, setAllUsers] = useState<User[]>(() =>
    getStorage<User[]>('allUsers', INITIAL_USERS)
  );
  const [fees, setFees] = useState<MessFee[]>(() =>
    getStorage<MessFee[]>('fees', INITIAL_FEES)
  );
  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    getStorage<PaymentRecord[]>('payments', INITIAL_PAYMENTS)
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() =>
    getStorage<MenuItem[]>('menuItems', INITIAL_MENU)
  );
  const [slots, setSlots] = useState<PickupSlot[]>(() =>
    getStorage<PickupSlot[]>('slots', INITIAL_SLOTS)
  );
  const [orders, setOrders] = useState<MealOrder[]>(() =>
    getStorage<MealOrder[]>('orders', INITIAL_ORDERS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStorage<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS)
  );
  const [upiSettings, setUpiSettingsState] = useState<UpiSettings>(() =>
    getStorage<UpiSettings>('upiSettings', INITIAL_UPI_SETTINGS)
  );
  const [messConfig, setMessConfigState] = useState<MessConfig>(() =>
    getStorage<MessConfig>('messConfig', INITIAL_CONFIG)
  );

  const [activeTokenOrder, setActiveTokenOrder] = useState<MealOrder | null>(null);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState<boolean>(false);

  // Sync to storage
  useEffect(() => setStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => setStorage('allUsers', allUsers), [allUsers]);
  useEffect(() => setStorage('fees', fees), [fees]);
  useEffect(() => setStorage('payments', payments), [payments]);
  useEffect(() => setStorage('menuItems', menuItems), [menuItems]);
  useEffect(() => setStorage('slots', slots), [slots]);
  useEffect(() => setStorage('orders', orders), [orders]);
  useEffect(() => setStorage('notifications', notifications), [notifications]);
  useEffect(() => setStorage('upiSettings', upiSettings), [upiSettings]);
  useEffect(() => setStorage('messConfig', messConfig), [messConfig]);

  const students = allUsers.filter((u) => u.role === 'student');

  const login = (idOrEmail: string, role: 'student' | 'admin'): boolean => {
    const trimmed = idOrEmail.trim().toLowerCase();
    const user = allUsers.find((u) => {
      if (u.role !== role) return false;
      if (u.email.toLowerCase() === trimmed) return true;
      if (u.studentId && u.studentId.toLowerCase() === trimmed) return true;
      return false;
    });

    if (user) {
      setCurrentUser(user);
      setCurrentView(role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('student-dashboard');
    }
  };

  const switchPersona = (role: 'student' | 'admin') => {
    if (role === 'student') {
      const student = allUsers.find((u) => u.role === 'student') || allUsers[0];
      switchUser(student);
      setCurrentView('student-dashboard');
    } else {
      const admin = allUsers.find((u) => u.role === 'admin') || allUsers[allUsers.length - 1];
      switchUser(admin);
      setCurrentView('admin-dashboard');
    }
  };

  const resetData = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    setAllUsers(INITIAL_USERS);
    setFees(INITIAL_FEES);
    setPayments(INITIAL_PAYMENTS);
    setMenuItems(INITIAL_MENU);
    setSlots(INITIAL_SLOTS);
    setOrders(INITIAL_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUpiSettingsState(INITIAL_UPI_SETTINGS);
    setMessConfigState(INITIAL_CONFIG);
    const defaultStudent = INITIAL_USERS[0];
    setCurrentUser(defaultStudent);
    setCurrentView('student-dashboard');
  };

  const addStudent = (studentData: Omit<User, 'id' | 'role'>) => {
    const newStudentId = studentData.studentId || `STU20260${allUsers.length + 1}`;
    const newStudent: User = {
      ...studentData,
      id: `user-stu-${Date.now()}`,
      studentId: newStudentId,
      role: 'student',
      avatar:
        studentData.avatar ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    };

    setAllUsers((prev) => [...prev, newStudent]);

    // Also create initial fee record
    const newFee: MessFee = {
      id: `fee-${Date.now()}`,
      studentId: newStudentId,
      studentName: newStudent.name,
      month: 'September 2026',
      baseAmount: messConfig.defaultMonthlyFee - 300,
      maintenanceAmount: 200,
      specialCharges: 100,
      totalAmount: messConfig.defaultMonthlyFee,
      dueDate: messConfig.defaultDueDate,
      status: 'pending',
    };
    setFees((prev) => [...prev, newFee]);
  };

  const getStudentFee = (studentId?: string) => {
    const targetId = studentId || currentUser?.studentId;
    if (!targetId) return undefined;
    return fees.find((f) => f.studentId === targetId && f.month.includes('September 2026'));
  };

  const payFee = (studentId: string, utrNumber: string, amount: number): string => {
    const receiptId = `REC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const feeItem = fees.find((f) => f.studentId === studentId);

    // Update Fee status
    setFees((prev) =>
      prev.map((f) => {
        if (f.studentId === studentId) {
          return {
            ...f,
            status: 'paid',
            paidAt: new Date().toLocaleString(),
            utrNumber,
            receiptId,
          };
        }
        return f;
      })
    );

    // Add to Payment records
    const studentObj = allUsers.find((u) => u.studentId === studentId);
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      feeId: feeItem?.id || `fee-manual-${Date.now()}`,
      studentId,
      studentName: studentObj?.name || 'Student',
      studentRoll: studentId,
      month: feeItem?.month || 'September 2026',
      amount,
      utrNumber,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'approved',
      paymentMethod: 'UPI',
      verifiedBy: 'Instant UPI Verification',
      verifiedAt: new Date().toLocaleString(),
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Send confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      studentId,
      title: 'Mess Fee Paid Successfully! 🎉',
      message: `Your payment of ₹${amount} for ${feeItem?.month || 'September'} has been verified. Receipt #${receiptId} generated.`,
      type: 'fee',
      date: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return receiptId;
  };

  const verifyPayment = (paymentId: string, approve: boolean) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: approve ? 'approved' : 'rejected',
              verifiedBy: 'Mess Warden',
              verifiedAt: new Date().toLocaleString(),
            }
          : p
      )
    );

    if (payment.feeId) {
      setFees((prev) =>
        prev.map((f) =>
          f.id === payment.feeId
            ? {
                ...f,
                status: approve ? 'paid' : 'pending',
                paidAt: approve ? new Date().toLocaleString() : undefined,
              }
            : f
        )
      );
    }
  };

  const updateMonthlyFeeConfig = (newFee: number, newDueDate: string) => {
    setMessConfigState((prev) => ({
      ...prev,
      defaultMonthlyFee: newFee,
      defaultDueDate: newDueDate,
    }));
    // Update pending fees
    setFees((prev) =>
      prev.map((f) =>
        f.status === 'pending'
          ? {
              ...f,
              baseAmount: newFee - 300,
              totalAmount: newFee,
              dueDate: newDueDate,
            }
          : f
      )
    );
  };

  // Menu items management
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  // Slots
  const updateSlotCapacity = (slotId: string, newCapacity: number) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, capacity: newCapacity } : s))
    );
  };

  const toggleSlotActive = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Orders
  const createOrder = (orderData: {
    slotId: string;
    items: { menuItemId: string; name: string; quantity: number; price: number; imageEmoji?: string }[];
    specialInstructions?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner';
    date?: string;
  }): MealOrder | null => {
    const targetSlot = slots.find((s) => s.id === orderData.slotId);
    if (!targetSlot || !targetSlot.isActive) return null;
    if (targetSlot.bookedCount >= targetSlot.capacity) return null;

    // Calculate unique token number (e.g. B-105)
    const tokenPrefix = (orderData.mealType || 'breakfast').charAt(0).toUpperCase();
    const tokenNum = 100 + orders.length + 1;
    const tokenNumber = `${tokenPrefix}-${tokenNum}`;

    const totalQuantity = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: MealOrder = {
      id: `ORD-2026-${tokenNum}`,
      tokenNumber,
      studentId: currentUser?.studentId || 'STU-GUEST',
      studentName: currentUser?.name || 'Student',
      studentRoll: currentUser?.studentId || 'STU-GUEST',
      hostelBlock: currentUser?.hostelBlock || 'Hostel Campus',
      date: orderData.date || now.toISOString().split('T')[0],
      slotId: targetSlot.id,
      slotTime: `${targetSlot.startTime} – ${targetSlot.endTime}`,
      mealType: orderData.mealType || 'breakfast',
      items: orderData.items,
      totalQuantity,
      totalAmount,
      status: 'booked',
      createdAt: `${now.toISOString().split('T')[0]} ${timeString}`,
      specialInstructions: orderData.specialInstructions,
    };

    // Increment slot booked count
    setSlots((prev) =>
      prev.map((s) =>
        s.id === orderData.slotId ? { ...s, bookedCount: s.bookedCount + 1 } : s
      )
    );

    setOrders((prev) => [newOrder, ...prev]);

    // Send notification to student
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      studentId: currentUser?.studentId || 'all',
      title: `Token ${tokenNumber} Generated! 🎫`,
      message: `Your breakfast pickup is confirmed for ${targetSlot.startTime} – ${targetSlot.endTime}. Show token at counter.`,
      type: 'meal',
      date: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    setActiveTokenOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...o,
            status: newStatus,
            readyAt: newStatus === 'ready' ? nowStr : o.readyAt,
            collectedAt: newStatus === 'collected' ? nowStr : o.collectedAt,
          };
        }
        return o;
      })
    );

    // Notify student if ready
    const order = orders.find((o) => o.id === orderId);
    if (order && newStatus === 'ready') {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        studentId: order.studentId,
        title: `Your meal token ${order.tokenNumber} is READY! 🔔`,
        message: `Your order is hot and ready at Counter #1. Please collect during your slot (${order.slotTime}).`,
        type: 'meal',
        date: 'Just now',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== 'booked') return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );

    // Free up slot count
    setSlots((prev) =>
      prev.map((s) =>
        s.id === order.slotId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s
      )
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const sendBroadcastReminder = (
    targetStudentIds: string[],
    message: string,
    title: string = 'Urgent Mess Fee Reminder'
  ) => {
    const newItems: NotificationItem[] = targetStudentIds.map((sId) => ({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId: sId,
      title,
      message,
      type: 'fee',
      date: 'Just now',
      read: false,
    }));

    setNotifications((prev) => [...newItems, ...prev]);
  };

  // UPI
  const updateUpiSettings = (settings: Partial<UpiSettings>) => {
    setUpiSettingsState((prev) => ({
      ...prev,
      ...settings,
      lastUpdated: new Date().toISOString().split('T')[0],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        login,
        logout,
        switchUser,
        switchPersona,
        resetData,
        students,
        allUsers,
        addStudent,
        fees,
        payments,
        getStudentFee,
        payFee,
        verifyPayment,
        updateMonthlyFeeConfig,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        slots,
        updateSlotCapacity,
        toggleSlotActive,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        notifications,
        markNotificationRead,
        sendBroadcastReminder,
        upiSettings,
        updateUpiSettings,
        messConfig,
        activeTokenOrder,
        setActiveTokenOrder,
        isFeeModalOpen,
        setIsFeeModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
