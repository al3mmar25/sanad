import React, { useState, useMemo, useEffect } from "react";
import {
  Car, Wind, Refrigerator, Plus, Search, Bell, SlidersHorizontal,
  Settings as SettingsIcon, ChevronLeft, ChevronRight, Calendar, MapPin,
  Wrench, Camera, FileText, Check, AlertCircle, Clock, User, Languages,
  X, Image as ImageIcon, Home as HomeIcon, Trash2, Sparkles, Sprout,
  ArrowRight, Phone, CreditCard, BookOpen, Contact, ArrowUpDown,
  Gauge, Star, BellRing, Info, Sun, CheckCircle2, TrendingUp,
} from "lucide-react";

/* Sanad — Family Life Admin Tracker (سند)
   v0.5: My items list in settings · Edit items · Appointments & Others types
   v0.4: Daily odometer projection · Mark-as-completed · Custom garages · Calendar view
   v0.3: Smart notifications · Odometer · Kuwait dealers · Interval auto-calc · Garden · Summer alert */

// ========== TRANSLATIONS ==========
const T = {
  en: {
    appName: "Sanad", brandTag: "your family's backbone",
    welcome: {
      hello: "Ahlan wa Sahlan",
      title: "One app. One family. Zero missed deadlines.",
      subtitle: "Track cars, ACs, Civil IDs, passports, car registrations, licenses, gardens, and everything else the family has to renew or service.",
      features: [
        { t: "Shared with family", s: "No logins. Everyone sees the same list." },
        { t: "Smart reminders", s: "90 days for passports. 14 days for oil changes. Right cadence for each." },
        { t: "Kuwait-aware", s: "Official dealers built-in. Km tracking. Summer AC alerts." },
      ],
      cta: "Get Started", skip: "Skip",
    },
    home: {
      greet: "Ahlan wa Sahlan", sub: "Here's what needs attention",
      search: "Search item or owner…",
      overdue: "Overdue", dueSoon: "Due soon", onTrack: "On track",
      filter: "Filter", clearAll: "Clear all", apply: "Apply",
      empty: "No items yet", emptySub: "Add your first item and start tracking.",
      addFirst: "Add your first item",
      daysOverdue: "days late", dayOverdue: "day late",
      inDays: "in {n} days", inMonths: "in {n} months", tomorrow: "tomorrow", today: "today",
      noResults: "No matches for your filters",
      kmToGo: "km to go", kmOverdue: "km overdue",
    },
    filterSheet: {
      title: "Filter items", sectionStatus: "By status",
      sectionPersonal: "Personal", sectionHome: "Home", sectionReminders: "Reminders",
      sectionOwner: "By owner",
    },
    types: {
      car_service: { label: "Car Service", dateLabel: "Next service" },
      car_registration: { label: "Car Registration", dateLabel: "Renewal" },
      civil_id: { label: "Civil ID", dateLabel: "Renewal" },
      passport: { label: "Passport", dateLabel: "Renewal" },
      driving_license: { label: "Driving License", dateLabel: "Renewal" },
      ac: { label: "AC", dateLabel: "Next service" },
      elevator: { label: "Elevator", dateLabel: "Next service" },
      appliance: { label: "Appliance", dateLabel: "Next service" },
      garden: { label: "Garden", dateLabel: "Next maintenance" },
      appointment: { label: "Appointment", dateLabel: "Scheduled for" },
      other: { label: "Other", dateLabel: "Due" },
    },
    fields: {
      make: "Make", model: "Model", year: "Year", plate: "Plate Number",
      owner: "Owner", holderName: "Holder Name", civilIdNumber: "Civil ID Number",
      passportNumber: "Passport Number", licenseNumber: "License Number",
      nationality: "Nationality", brand: "Brand", location: "Location",
      area: "Area / Size", tonnage: "Tonnage", applianceType: "Appliance Type",
      serviceCompany: "Service Company", emergencyPhone: "Emergency Phone",
      purchaseDate: "Purchase Date", issueDate: "Issue Date",
      warrantyExpiry: "Warranty Ends", expiryDate: "Expiry Date",
      nextServiceDate: "Next Service Date", lastService: "Last Service",
      issuingAuthority: "Issuing Authority", notes: "Notes",
      currentOdometer: "Current Odometer (km)",
      serviceIntervalKm: "Service every (km)",
      serviceIntervalMonths: "Service every (months)",
      title: "Title",
    },
    placeholders: {
      make: "e.g. Toyota", model: "e.g. Land Cruiser", year: "e.g. 2020",
      plate: "e.g. 12345", owner: "Family member name",
      holderName: "Full name as on document", civilIdNumber: "12 digits",
      passportNumber: "e.g. A1234567", licenseNumber: "License number",
      nationality: "e.g. Kuwaiti", brand: "e.g. Gree, LG, Samsung",
      location: "e.g. Living Room, Chalet, 3rd Floor",
      area: "e.g. 200 sqm", tonnage: "e.g. 1.5 ton",
      applianceType: "e.g. Refrigerator, Washer",
      serviceCompany: "Company name", emergencyPhone: "+965 XXXX XXXX",
      issuingAuthority: "e.g. PACI, MOI, GDT",
      notes: "Anything you want to remember…",
      currentOdometer: "e.g. 64500", serviceIntervalKm: "e.g. 10000", serviceIntervalMonths: "e.g. 6",
      title: "e.g. Doctor appointment, Flight, Meeting",
    },
    device: {
      nextService: "Next service", photos: "Photos",
      addService: "Log a service", addPhoto: "Add photo",
      noServices: "No services logged yet",
      noPhotos: "No photos yet. Add receipts, documents, or item photos.",
      totalSpent: "Total spent", servicesCount: "services",
      tabOverview: "Overview", tabHistory: "History", tabNotes: "Notes",
      callCenter: "Call", docInfo: "Information",
      officialDealer: "Official Dealer", officialBadge: "Official",
      recommendedCenters: "My Recommended Centers",
      addRecommended: "+ Add recommended center",
      editRecommended: "Edit selection",
      noRecommended: "Save your favorite garages for quick access",
      odometer: "Odometer", kmSinceService: "km since last service",
      kmRemaining: "km to next service", kmOver: "km over",
      kmEstimated: "estimated today",
      avgPerDay: "avg {n} km/day",
      serviceInterval: "Service interval",
      everyKm: "Every {n} km", everyMonths: "Every {n} months",
      reminders: "Smart reminders", remindersSub: "You'll be notified:",
      daysBefore: "{n} days before", dayBefore: "1 day before", onDueDate: "on the due date",
      summerAlert: "Pre-summer service recommended",
      summerAlertSub: "No service since last September. Kuwait summer is coming — schedule before it hits.",
      markCompleted: "Mark as completed",
      markCompletedSub: "Log this task as done — next reminder will auto-update",
    },
    complete: {
      titleService: "Log completed service",
      titleRenewal: "Log renewal",
      date: "Completion date",
      description: "What was done",
      descriptionPh: "e.g. Oil change + air filter",
      cost: "Cost (KWD)",
      costPh: "0.000",
      center: "Service center",
      centerPh: "Which garage / dealer?",
      odometer: "Odometer at service (km)",
      odometerPh: "e.g. 73500",
      newExpiry: "New expiry date",
      save: "Save & update schedule",
      cancel: "Cancel",
      nextServiceCalc: "Next service will be auto-scheduled",
    },
    customGarage: {
      title: "Add my garage",
      subtitle: "Save a center not in the list",
      name: "Name",
      namePh: "e.g. Abu Ali Garage",
      phone: "Phone",
      phonePh: "+965 XXXX XXXX",
      location: "Area",
      locationPh: "e.g. Shuwaikh, Hawalli",
      specialty: "Specialty (optional)",
      specialtyPh: "e.g. Oil change, brakes",
      save: "Save garage",
      addNew: "+ Add my own garage",
      myGarages: "My garages",
      curated: "Curated list",
      remove: "Remove",
    },
    calendar: {
      title: "Calendar",
      sub: "Everything on your schedule",
      months: ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      today: "Today",
      noTasks: "Nothing scheduled for this day",
      tasksOnDay: "Tasks on this day",
      prevMonth: "Previous month",
      nextMonth: "Next month",
    },
    garageSheet: {
      title: "Select recommended centers",
      subtitle: "Pick the garages you trust — they'll show up in this item's details",
      emptyCategory: "No centers in this category yet",
      done: "Done", selectedCount: "{n} selected",
    },
    addItem: {
      title: "Add item", typeLabel: "What do you want to track?",
      sectionPersonal: "Personal", sectionHome: "Home", sectionReminders: "Reminders",
      save: "Save item",
      addPhoto: "Tap to add photo",
      intervalHelp: "Set either one — the app auto-calculates the next service date",
    },
    editItem: {
      title: "Edit item",
      save: "Save changes",
      editLogEntry: "Item details edited",
      fieldsChanged: "{n} fields changed",
    },
    alerts: {
      title: "Alerts", sub: "Everything that needs your attention",
      overdueTitle: "Overdue", upcomingTitle: "Due within 30 days",
      allClear: "All clear!", allClearSub: "Every item is up to date.",
    },
    settings: {
      title: "Settings", language: "Language", languageSub: "App language & direction",
      notifications: "Notifications", notificationsSub: "Smart reminders per item type",
      familyMembers: "Family members", familyMembersSub: "people tracked",
      data: "Data", exportData: "Export all data",
      resetData: "Reset all data", loadSample: "Load sample data",
      version: "Version 0.5 — Prototype",
      myItems: "My items",
      myItemsSub: "All your physical items · tap any to edit",
      myItemsEmpty: "No items added yet",
      personalItems: "Personal",
      homeItems: "Home",
      editItem: "Edit",
      itemCount: "{n} items",
    },
    nav: { home: "Home", calendar: "Calendar", alerts: "Alerts", settings: "Settings" },
  },
  ar: {
    appName: "سند", brandTag: "سندك وسند عائلتك",
    welcome: {
      hello: "أهلاً وسهلاً",
      title: "تطبيق واحد. عائلة واحدة. لا مواعيد فائتة.",
      subtitle: "تابع السيارات، المكيفات، البطاقة المدنية، الجوازات، الملكية، الرخص، الحديقة، وكل شيء تحتاج العائلة تجديده أو صيانته.",
      features: [
        { t: "مشترك مع العائلة", s: "بدون حسابات. الكل يرى نفس القائمة." },
        { t: "تذكير ذكي", s: "٩٠ يوم للجواز. ١٤ يوم لتغيير الزيت. كل شي بوقته." },
        { t: "مصمم للكويت", s: "وكلاء رسميين جاهزين. متابعة الكيلومترات. تنبيهات قبل الصيف." },
      ],
      cta: "يلا نبدأ", skip: "تخطي",
    },
    home: {
      greet: "أهلاً وسهلاً", sub: "هذه الأمور تحتاج انتباهك",
      search: "ابحث عن شيء أو مالك…",
      overdue: "متأخرة", dueSoon: "قريبة", onTrack: "منتظمة",
      filter: "تصفية", clearAll: "مسح الكل", apply: "تطبيق",
      empty: "لا يوجد شيء بعد", emptySub: "أضف أول شي وابدأ المتابعة.",
      addFirst: "أضف أول شي",
      daysOverdue: "يوم تأخير", dayOverdue: "يوم تأخير",
      inDays: "بعد {n} أيام", inMonths: "بعد {n} أشهر", tomorrow: "غداً", today: "اليوم",
      noResults: "لا توجد نتائج للتصفية",
      kmToGo: "كم متبقي", kmOverdue: "كم تأخير",
    },
    filterSheet: {
      title: "تصفية", sectionStatus: "حسب الحالة",
      sectionPersonal: "شخصي", sectionHome: "البيت", sectionReminders: "تذكيرات",
      sectionOwner: "حسب المالك",
    },
    types: {
      car_service: { label: "صيانة سيارة", dateLabel: "الصيانة القادمة" },
      car_registration: { label: "ملكية السيارة", dateLabel: "التجديد" },
      civil_id: { label: "البطاقة المدنية", dateLabel: "التجديد" },
      passport: { label: "جواز السفر", dateLabel: "التجديد" },
      driving_license: { label: "رخصة القيادة", dateLabel: "التجديد" },
      ac: { label: "مكيف", dateLabel: "الصيانة القادمة" },
      elevator: { label: "مصعد", dateLabel: "الصيانة القادمة" },
      appliance: { label: "جهاز منزلي", dateLabel: "الصيانة القادمة" },
      garden: { label: "حديقة", dateLabel: "الصيانة القادمة" },
      appointment: { label: "موعد", dateLabel: "تاريخ الموعد" },
      other: { label: "أخرى", dateLabel: "الاستحقاق" },
    },
    fields: {
      make: "الشركة المصنعة", model: "الموديل", year: "سنة الصنع", plate: "رقم اللوحة",
      owner: "المالك", holderName: "اسم صاحب الوثيقة", civilIdNumber: "رقم البطاقة المدنية",
      passportNumber: "رقم الجواز", licenseNumber: "رقم الرخصة",
      nationality: "الجنسية", brand: "الماركة", location: "الموقع",
      area: "المساحة", tonnage: "السعة (طن)", applianceType: "نوع الجهاز",
      serviceCompany: "شركة الصيانة", emergencyPhone: "رقم الطوارئ",
      purchaseDate: "تاريخ الشراء", issueDate: "تاريخ الإصدار",
      warrantyExpiry: "انتهاء الضمان", expiryDate: "تاريخ الانتهاء",
      nextServiceDate: "الصيانة القادمة", lastService: "آخر صيانة",
      issuingAuthority: "جهة الإصدار", notes: "ملاحظات",
      currentOdometer: "قراءة العداد (كم)",
      serviceIntervalKm: "صيانة كل (كم)", serviceIntervalMonths: "صيانة كل (شهر)",
      title: "العنوان",
    },
    placeholders: {
      make: "مثل: تويوتا", model: "مثل: لاند كروزر", year: "مثل: 2020",
      plate: "مثل: 12345", owner: "اسم فرد العائلة",
      holderName: "الاسم كما في الوثيقة", civilIdNumber: "12 رقم",
      passportNumber: "مثل: A1234567", licenseNumber: "رقم الرخصة",
      nationality: "مثل: كويتي", brand: "مثل: جري، إل جي، سامسونج",
      location: "مثل: الصالة، الشاليه، الطابق الثالث",
      area: "مثل: 200 متر مربع", tonnage: "مثل: 1.5 طن",
      applianceType: "مثل: ثلاجة، غسالة",
      serviceCompany: "اسم الشركة", emergencyPhone: "+965 XXXX XXXX",
      issuingAuthority: "مثل: الهيئة العامة للمعلومات المدنية",
      notes: "أي شيء تريد تذكره…",
      currentOdometer: "مثل: 64500", serviceIntervalKm: "مثل: 10000", serviceIntervalMonths: "مثل: 6",
      title: "مثل: موعد الطبيب، رحلة، اجتماع",
    },
    device: {
      nextService: "الصيانة القادمة", photos: "الصور",
      addService: "تسجيل صيانة", addPhoto: "إضافة صورة",
      noServices: "لم يتم تسجيل أي صيانة بعد",
      noPhotos: "لا توجد صور بعد. أضف فواتير، وثائق، أو صور.",
      totalSpent: "إجمالي المصروف", servicesCount: "صيانات",
      tabOverview: "عام", tabHistory: "السجل", tabNotes: "ملاحظات",
      callCenter: "اتصال", docInfo: "البيانات",
      officialDealer: "الوكيل الرسمي", officialBadge: "رسمي",
      recommendedCenters: "مراكزي الموصى بها",
      addRecommended: "+ إضافة مركز",
      editRecommended: "تعديل الاختيار",
      noRecommended: "احفظ الكراجات المفضلة للوصول السريع",
      odometer: "عداد المسافة", kmSinceService: "كم منذ آخر صيانة",
      kmRemaining: "كم حتى الصيانة القادمة", kmOver: "كم زيادة",
      kmEstimated: "تقدير اليوم",
      avgPerDay: "معدل {n} كم/يوم",
      serviceInterval: "فترة الصيانة",
      everyKm: "كل {n} كم", everyMonths: "كل {n} شهر",
      reminders: "تذكيرات ذكية", remindersSub: "راح يوصلك تنبيه:",
      daysBefore: "قبل {n} يوم", dayBefore: "قبل يوم واحد", onDueDate: "في يوم الاستحقاق",
      summerAlert: "ينصح بصيانة ما قبل الصيف",
      summerAlertSub: "لا توجد صيانة منذ سبتمبر الماضي. صيف الكويت قادم — حدد موعد قبل ما يبدأ الحر.",
      markCompleted: "تم الإنجاز",
      markCompletedSub: "سجل المهمة كمنجزة — التذكير التالي يتحدث تلقائياً",
    },
    complete: {
      titleService: "تسجيل صيانة تمت",
      titleRenewal: "تسجيل تجديد",
      date: "تاريخ الإنجاز",
      description: "وش تم عمله",
      descriptionPh: "مثل: تغيير زيت وفلتر هواء",
      cost: "التكلفة (د.ك)",
      costPh: "0.000",
      center: "مركز الخدمة",
      centerPh: "أي كراج / وكيل؟",
      odometer: "العداد وقت الصيانة (كم)",
      odometerPh: "مثل: 73500",
      newExpiry: "تاريخ الانتهاء الجديد",
      save: "حفظ وتحديث الجدول",
      cancel: "إلغاء",
      nextServiceCalc: "الصيانة القادمة راح تتجدول تلقائياً",
    },
    customGarage: {
      title: "إضافة كراج",
      subtitle: "احفظ مركز ما موجود بالقائمة",
      name: "الاسم",
      namePh: "مثل: كراج أبو علي",
      phone: "رقم الهاتف",
      phonePh: "+965 XXXX XXXX",
      location: "المنطقة",
      locationPh: "مثل: الشويخ، حولي",
      specialty: "التخصص (اختياري)",
      specialtyPh: "مثل: تغيير زيت، فرامل",
      save: "حفظ الكراج",
      addNew: "+ إضافة كراج شخصي",
      myGarages: "كراجاتي",
      curated: "القائمة المختارة",
      remove: "حذف",
    },
    calendar: {
      title: "التقويم",
      sub: "كل شي في جدولك",
      months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
               "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
      days: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
      today: "اليوم",
      noTasks: "لا توجد مهام في هذا اليوم",
      tasksOnDay: "مهام اليوم",
      prevMonth: "الشهر السابق",
      nextMonth: "الشهر التالي",
    },
    garageSheet: {
      title: "اختر المراكز الموصى بها",
      subtitle: "اختر الكراجات التي تثق بها — راح تظهر في تفاصيل الجهاز",
      emptyCategory: "لا توجد مراكز في هذه الفئة بعد",
      done: "تم", selectedCount: "{n} مختار",
    },
    addItem: {
      title: "إضافة شي", typeLabel: "شنو تبي تتابع؟",
      sectionPersonal: "شخصي", sectionHome: "البيت", sectionReminders: "تذكيرات",
      save: "حفظ",
      addPhoto: "اضغط لإضافة صورة",
      intervalHelp: "اختر واحد — التطبيق يحسب تاريخ الصيانة القادم تلقائياً",
    },
    editItem: {
      title: "تعديل البيانات",
      save: "حفظ التعديلات",
      editLogEntry: "تم تعديل بيانات البند",
      fieldsChanged: "{n} حقول تم تعديلها",
    },
    alerts: {
      title: "التنبيهات", sub: "كل ما يحتاج انتباهك",
      overdueTitle: "متأخرة", upcomingTitle: "خلال 30 يوم",
      allClear: "كل شيء تمام!", allClearSub: "كل شي محدّث.",
    },
    settings: {
      title: "الإعدادات", language: "اللغة", languageSub: "لغة التطبيق والاتجاه",
      notifications: "التنبيهات", notificationsSub: "تذكير ذكي حسب نوع كل شي",
      familyMembers: "أفراد العائلة", familyMembersSub: "أشخاص تتابع لهم",
      data: "البيانات", exportData: "تصدير كل البيانات",
      resetData: "حذف كل البيانات", loadSample: "تحميل بيانات تجريبية",
      version: "الإصدار 0.5 — نموذج تجريبي",
      myItems: "أغراضي",
      myItemsSub: "كل الأشياء اللي تتابعها · اضغط لأي شي للتعديل",
      myItemsEmpty: "ما تم إضافة أي شيء بعد",
      personalItems: "شخصي",
      homeItems: "البيت",
      editItem: "تعديل",
      itemCount: "{n} عنصر",
    },
    nav: { home: "الرئيسية", calendar: "التقويم", alerts: "التنبيهات", settings: "الإعدادات" },
  },
};

// ========== NOTIFICATION CADENCES (days before due date) ==========
const NOTIFICATION_CADENCES = {
  civil_id: [90, 60, 30, 14, 7, 1, 0],
  passport: [90, 60, 30, 14, 7, 1, 0],
  driving_license: [90, 60, 30, 14, 7, 1, 0],
  car_registration: [60, 30, 14, 7, 1, 0],
  car_service: [14, 7, 1, 0],
  ac: [14, 7, 1, 0],
  elevator: [30, 14, 7, 1],
  appliance: [14, 7, 1],
  garden: [14, 7, 1],
  appointment: [7, 3, 1, 0],
  other: [14, 7, 1, 0],
};

// ========== KUWAIT OFFICIAL DEALERS ==========
const OFFICIAL_DEALERS_DB = {
  car: {
    Toyota: { name: "Al-Sayer Toyota", nameAr: "السيارة تويوتا", phone: "180-3803", phoneRaw: "+9651803803", location: "Shuwaikh Industrial", locationAr: "الشويخ الصناعية", hours: "Sun–Thu 7:30 AM – 5:00 PM" },
    Lexus: { name: "Al-Sayer Lexus", nameAr: "السيارة لكزس", phone: "180-3803", phoneRaw: "+9651803803", location: "Shuwaikh", locationAr: "الشويخ", hours: "Sun–Thu 8:00 AM – 5:00 PM" },
    Nissan: { name: "Al-Babtain Nissan", nameAr: "البابطين نيسان", phone: "180-8088", phoneRaw: "+9651808088", location: "Al-Rai", locationAr: "الري", hours: "Sun–Thu 7:30 AM – 5:00 PM" },
    Infiniti: { name: "Al-Babtain Infiniti", nameAr: "البابطين إنفينيتي", phone: "180-8088", phoneRaw: "+9651808088", location: "Al-Rai", locationAr: "الري" },
    Mercedes: { name: "Behbehani Motors (Mercedes-Benz)", nameAr: "بهبهاني للسيارات (مرسيدس)", phone: "180-6060", phoneRaw: "+9651806060", location: "Shuwaikh", locationAr: "الشويخ", hours: "Sun–Thu 8:00 AM – 5:00 PM" },
    BMW: { name: "Ali Alghanim & Sons Automotive", nameAr: "علي الغانم وأولاده للسيارات", phone: "180-1911", phoneRaw: "+9651801911", location: "Shuwaikh", locationAr: "الشويخ" },
    Ford: { name: "Alghanim Auto Ford", nameAr: "الغانم للسيارات فورد", phone: "180-4444", phoneRaw: "+9651804444", location: "Shuwaikh", locationAr: "الشويخ" },
    Chevrolet: { name: "Mohamed Naser Al-Sayer Chevrolet", nameAr: "محمد ناصر السيارة شيفروليه", phone: "180-2020", phoneRaw: "+9651802020", location: "Shuwaikh", locationAr: "الشويخ" },
    Honda: { name: "Abdulmohsen Al-Babtain Honda", nameAr: "عبدالمحسن البابطين هوندا", phone: "180-1242", phoneRaw: "+9651801242", location: "Al-Rai", locationAr: "الري" },
    Mitsubishi: { name: "Al-Mulla Automobiles", nameAr: "الملا للسيارات", phone: "180-4488", phoneRaw: "+9651804488", location: "Shuwaikh", locationAr: "الشويخ" },
    Hyundai: { name: "Al Ghanim Hyundai", nameAr: "الغانم هيونداي", phone: "180-5454", phoneRaw: "+9651805454", location: "Shuwaikh", locationAr: "الشويخ" },
    Kia: { name: "Al-Zayani Kia", nameAr: "الزياني كيا", phone: "180-0505", phoneRaw: "+9651800505", location: "Shuwaikh", locationAr: "الشويخ" },
    Mazda: { name: "Al Shaya & Al Sagar Mazda", nameAr: "الشايع والصقر مازدا", phone: "180-6262", phoneRaw: "+9651806262", location: "Shuwaikh", locationAr: "الشويخ" },
    GMC: { name: "Alghanim GMC", nameAr: "الغانم جي إم سي", phone: "180-4444", phoneRaw: "+9651804444", location: "Shuwaikh", locationAr: "الشويخ" },
  },
  ac: {
    Gree: { name: "Gree Kuwait Service", nameAr: "مركز خدمة جري", phone: "2471-1100", phoneRaw: "+96524711100", location: "Shuwaikh Industrial", locationAr: "الشويخ الصناعية", hours: "Sat–Thu 8AM–8PM" },
    LG: { name: "LG AC Service Center", nameAr: "مركز خدمة LG للمكيفات", phone: "180-9009", phoneRaw: "+9651809009", location: "Hawalli", locationAr: "حولي" },
    Samsung: { name: "Samsung AC Service", nameAr: "خدمة سامسونج للمكيفات", phone: "180-3000", phoneRaw: "+9651803000", location: "Salmiya", locationAr: "السالمية" },
    Carrier: { name: "Carrier Kuwait", nameAr: "كاريير الكويت", phone: "2484-5555", phoneRaw: "+96524845555", location: "Shuwaikh", locationAr: "الشويخ" },
    York: { name: "York Kuwait Service", nameAr: "يورك الكويت", phone: "2471-8000", phoneRaw: "+96524718000", location: "Shuwaikh", locationAr: "الشويخ" },
    Wansa: { name: "Alghanim — Wansa Service", nameAr: "الغانم — ونسا", phone: "180-2626", phoneRaw: "+9651802626", location: "Shuwaikh", locationAr: "الشويخ" },
    Daikin: { name: "Daikin Kuwait", nameAr: "دايكن الكويت", phone: "2484-7777", phoneRaw: "+96524847777", location: "Shuwaikh", locationAr: "الشويخ" },
  },
  appliance: {
    LG: { name: "LG Home Appliances Kuwait", nameAr: "LG للأجهزة المنزلية", phone: "180-9009", phoneRaw: "+9651809009", location: "Hawalli", locationAr: "حولي", hours: "Sat–Thu 9AM–9PM" },
    Samsung: { name: "Samsung Kuwait Service", nameAr: "خدمة سامسونج", phone: "180-3000", phoneRaw: "+9651803000", location: "Salmiya", locationAr: "السالمية" },
    Bosch: { name: "Bosch Kuwait", nameAr: "بوش الكويت", phone: "180-2929", phoneRaw: "+9651802929", location: "Shuwaikh", locationAr: "الشويخ" },
    Whirlpool: { name: "Whirlpool Kuwait Service", nameAr: "ويرلبول الكويت", phone: "2484-3232", phoneRaw: "+96524843232", location: "Shuwaikh", locationAr: "الشويخ" },
    Ariston: { name: "Ariston Kuwait", nameAr: "أريستون الكويت", phone: "2244-1515", phoneRaw: "+96522441515", location: "Qibla", locationAr: "القبلة" },
    Wansa: { name: "Alghanim — Wansa", nameAr: "الغانم — ونسا", phone: "180-2626", phoneRaw: "+9651802626", location: "Shuwaikh", locationAr: "الشويخ" },
  },
  elevator: {
    Schindler: { name: "Schindler Kuwait", nameAr: "شيندلر الكويت", phone: "2471-9000", phoneRaw: "+96524719000", location: "Shuwaikh Industrial", locationAr: "الشويخ الصناعية", hours: "24/7 Emergency" },
    Otis: { name: "Otis Elevator Kuwait", nameAr: "أوتيس الكويت", phone: "2484-2424", phoneRaw: "+96524842424", location: "Shuwaikh", locationAr: "الشويخ", hours: "24/7 Emergency" },
    KONE: { name: "KONE Kuwait", nameAr: "كون الكويت", phone: "2471-5000", phoneRaw: "+96524715000", location: "Shuwaikh", locationAr: "الشويخ" },
    Mitsubishi: { name: "Mitsubishi Elevator — Al-Mulla", nameAr: "مصاعد ميتسوبيشي — الملا", phone: "2484-8080", phoneRaw: "+96524848080", location: "Shuwaikh", locationAr: "الشويخ" },
  },
};

// ========== RECOMMENDED GARAGES (user-selectable) ==========
const RECOMMENDED_GARAGES = [
  { id: "fast_fit_rai", category: "car", name: "Fast Fit", nameAr: "فاست فت", location: "Al-Rai", locationAr: "الري", phone: "2473-0000", phoneRaw: "+96524730000", specialty: "Tires, oil, alignment", specialtyAr: "إطارات، زيت، ميزان" },
  { id: "speed_lube", category: "car", name: "Speed Lube Kuwait", nameAr: "سبيد لوب", location: "Shuwaikh", locationAr: "الشويخ", phone: "2481-2222", phoneRaw: "+96524812222", specialty: "Oil change, quick service", specialtyAr: "تغيير زيت وصيانة سريعة" },
  { id: "magic_auto", category: "car", name: "Magic Auto Care", nameAr: "ماجيك للعناية بالسيارة", location: "Salmiya", locationAr: "السالمية", phone: "2571-8888", phoneRaw: "+96525718888", specialty: "General mechanical", specialtyAr: "ميكانيكا عامة" },
  { id: "autohaus", category: "car", name: "AutoHaus Kuwait", nameAr: "أوتوهاوس", location: "Shuwaikh", locationAr: "الشويخ", phone: "2484-1100", phoneRaw: "+96524841100", specialty: "European cars", specialtyAr: "سيارات أوروبية" },
  { id: "pro_tyre", category: "car", name: "Pro Tyre Center", nameAr: "برو تايرز", location: "Al-Rai", locationAr: "الري", phone: "2473-5656", phoneRaw: "+96524735656", specialty: "Tires, batteries", specialtyAr: "إطارات وبطاريات" },
  { id: "cool_tech", category: "ac", name: "Cool Tech AC Services", nameAr: "كول تك لصيانة المكيفات", location: "Hawalli", locationAr: "حولي", phone: "2261-5555", phoneRaw: "+96522615555", specialty: "All brands, annual contracts", specialtyAr: "كل الماركات، عقود سنوية" },
  { id: "ac_master", category: "ac", name: "AC Master", nameAr: "ماستر للمكيفات", location: "Farwaniya", locationAr: "الفروانية", phone: "2473-9999", phoneRaw: "+96524739999", specialty: "Gas recharge, installation", specialtyAr: "شحن غاز وتركيب" },
  { id: "arctic_ac", category: "ac", name: "Arctic Climate Control", nameAr: "أركتيك للتبريد", location: "Jabriya", locationAr: "الجابرية", phone: "2531-4444", phoneRaw: "+96525314444", specialty: "Central AC, maintenance", specialtyAr: "تكييف مركزي وصيانة" },
  { id: "breeze_ac", category: "ac", name: "Breeze AC Kuwait", nameAr: "بريز للمكيفات", location: "Salmiya", locationAr: "السالمية", phone: "2571-3030", phoneRaw: "+96525713030", specialty: "Emergency service", specialtyAr: "خدمة طوارئ" },
  { id: "home_pro", category: "appliance", name: "Home Pro Service", nameAr: "هوم برو للصيانة", location: "Hawalli", locationAr: "حولي", phone: "2261-7777", phoneRaw: "+96522617777", specialty: "All major brands", specialtyAr: "جميع الماركات" },
  { id: "fix_it", category: "appliance", name: "Fix It Kuwait", nameAr: "فكس إت", location: "Salmiya", locationAr: "السالمية", phone: "2573-3333", phoneRaw: "+96525733333", specialty: "Same-day repair", specialtyAr: "إصلاح في نفس اليوم" },
  { id: "home_care", category: "appliance", name: "Home Care Services", nameAr: "هوم كير", location: "Jabriya", locationAr: "الجابرية", phone: "2531-2020", phoneRaw: "+96525312020", specialty: "Washers, fridges", specialtyAr: "غسالات وثلاجات" },
  { id: "green_gardens", category: "garden", name: "Green Gardens Kuwait", nameAr: "الحدائق الخضراء", location: "Abu Halifa", locationAr: "أبو حليفة", phone: "2391-2222", phoneRaw: "+96523912222", specialty: "Landscaping, irrigation", specialtyAr: "تنسيق حدائق وري" },
  { id: "al_dahra_nursery", category: "garden", name: "Al-Dahra Nursery", nameAr: "مشتل الضاحية", location: "Rabiya", locationAr: "الرابية", phone: "2476-1111", phoneRaw: "+96524761111", specialty: "Plants, monthly maintenance", specialtyAr: "نباتات وصيانة شهرية" },
  { id: "landscape_pro", category: "garden", name: "Landscape Pro", nameAr: "لاندسكيب برو", location: "Shuwaikh", locationAr: "الشويخ", phone: "2484-5555", phoneRaw: "+96524845555", specialty: "Irrigation systems", specialtyAr: "أنظمة الري" },
  { id: "desert_bloom", category: "garden", name: "Desert Bloom Landscaping", nameAr: "ديزرت بلوم", location: "Mishref", locationAr: "مشرف", phone: "2538-7070", phoneRaw: "+96525387070", specialty: "Desert-friendly plants", specialtyAr: "نباتات صحراوية" },
  { id: "kw_elevators", category: "elevator", name: "Kuwait Elevators Co.", nameAr: "شركة مصاعد الكويت", location: "Shuwaikh Industrial", locationAr: "الشويخ الصناعية", phone: "2481-0000", phoneRaw: "+96524810000", specialty: "All brands, 24/7", specialtyAr: "جميع الماركات، ٢٤/٧" },
  { id: "elevator_plus", category: "elevator", name: "Elevator Plus Kuwait", nameAr: "إلفيتور بلس", location: "Hawalli", locationAr: "حولي", phone: "2261-9090", phoneRaw: "+96522619090", specialty: "Maintenance contracts", specialtyAr: "عقود صيانة" },
];

// ========== ITEM TYPES ==========
const ITEM_TYPES = {
  car_service: {
    section: "personal", icon: Car, bg: "#FCE7D8", fg: "#9A4A1A",
    fields: ["make", "model", "year", "plate", "owner", "currentOdometer", "serviceIntervalKm", "serviceIntervalMonths", "purchaseDate", "warrantyExpiry", "nextServiceDate", "notes"],
    dateField: "nextServiceDate", hasServiceHistory: true,
    hasOdometer: true, hasInterval: true,
    officialDealerCategory: "car", officialDealerKey: "make",
    garageCategory: "car",
    buildName: (f) => [f.make, f.model, f.year].filter(Boolean).join(" "),
  },
  car_registration: {
    section: "personal", icon: FileText, bg: "#FEF3C7", fg: "#92400E",
    fields: ["plate", "make", "model", "owner", "issuingAuthority", "expiryDate", "notes"],
    dateField: "expiryDate", hasServiceHistory: false,
    buildName: (f, lang) => lang === "ar" ? `ملكية — ${f.plate || ""}` : `Registration — ${f.plate || ""}`,
  },
  civil_id: {
    section: "personal", icon: CreditCard, bg: "#DBEAFE", fg: "#1E40AF",
    fields: ["holderName", "civilIdNumber", "issueDate", "expiryDate", "notes"],
    dateField: "expiryDate", hasServiceHistory: false,
    buildName: (f, lang) => lang === "ar" ? `${f.holderName || ""} — البطاقة المدنية` : `${f.holderName || ""} — Civil ID`,
  },
  passport: {
    section: "personal", icon: BookOpen, bg: "#E0E7FF", fg: "#3730A3",
    fields: ["holderName", "passportNumber", "nationality", "issueDate", "expiryDate", "notes"],
    dateField: "expiryDate", hasServiceHistory: false,
    buildName: (f, lang) => lang === "ar" ? `${f.holderName || ""} — جواز` : `${f.holderName || ""} — Passport`,
  },
  driving_license: {
    section: "personal", icon: Contact, bg: "#E0F2FE", fg: "#075985",
    fields: ["holderName", "licenseNumber", "issueDate", "expiryDate", "notes"],
    dateField: "expiryDate", hasServiceHistory: false,
    buildName: (f, lang) => lang === "ar" ? `${f.holderName || ""} — رخصة` : `${f.holderName || ""} — License`,
  },
  ac: {
    section: "home", icon: Wind, bg: "#D9E9E3", fg: "#1E4D3F",
    fields: ["brand", "model", "location", "tonnage", "owner", "serviceIntervalMonths", "purchaseDate", "warrantyExpiry", "nextServiceDate", "notes"],
    dateField: "nextServiceDate", hasServiceHistory: true, hasInterval: true, hasSummerAlert: true,
    officialDealerCategory: "ac", officialDealerKey: "brand", garageCategory: "ac",
    buildName: (f, lang) => lang === "ar" ? `مكيف ${f.brand || ""} — ${f.location || ""}` : `${f.brand || ""} AC — ${f.location || ""}`,
  },
  elevator: {
    section: "home", icon: ArrowUpDown, bg: "#EADDF3", fg: "#5B3B7A",
    fields: ["brand", "location", "serviceCompany", "emergencyPhone", "serviceIntervalMonths", "lastService", "nextServiceDate", "notes"],
    dateField: "nextServiceDate", hasServiceHistory: true, hasInterval: true,
    officialDealerCategory: "elevator", officialDealerKey: "brand", garageCategory: "elevator",
    buildName: (f, lang) => lang === "ar" ? `مصعد — ${f.location || ""}` : `Elevator — ${f.location || ""}`,
  },
  appliance: {
    section: "home", icon: Refrigerator, bg: "#F3E8DA", fg: "#78350F",
    fields: ["applianceType", "brand", "model", "location", "owner", "serviceIntervalMonths", "purchaseDate", "warrantyExpiry", "nextServiceDate", "notes"],
    dateField: "nextServiceDate", hasServiceHistory: true, hasInterval: true,
    officialDealerCategory: "appliance", officialDealerKey: "brand", garageCategory: "appliance",
    buildName: (f) => [f.brand, f.applianceType].filter(Boolean).join(" "),
  },
  garden: {
    section: "home", icon: Sprout, bg: "#D4F1D4", fg: "#2D5F2D",
    fields: ["location", "area", "serviceCompany", "serviceIntervalMonths", "lastService", "nextServiceDate", "notes"],
    dateField: "nextServiceDate", hasServiceHistory: true, hasInterval: true, garageCategory: "garden",
    buildName: (f, lang) => lang === "ar" ? `حديقة — ${f.location || ""}` : `Garden — ${f.location || ""}`,
  },
  appointment: {
    section: "reminders", icon: Calendar, bg: "#EDE4FF", fg: "#6B21A8",
    fields: ["title", "location", "owner", "nextServiceDate", "notes"],
    dateField: "nextServiceDate", hasServiceHistory: false,
    buildName: (f) => f.title || "—",
  },
  other: {
    section: "reminders", icon: BellRing, bg: "#FFE4E6", fg: "#9F1239",
    fields: ["title", "owner", "nextServiceDate", "notes"],
    dateField: "nextServiceDate", hasServiceHistory: false,
    buildName: (f) => f.title || "—",
  },
};

const FIELD_TYPES = {
  make: "text", model: "text", year: "number", plate: "text",
  owner: "text", holderName: "text", civilIdNumber: "text",
  passportNumber: "text", licenseNumber: "text", nationality: "text",
  brand: "text", location: "text", area: "text", tonnage: "text",
  applianceType: "text", serviceCompany: "text", emergencyPhone: "tel",
  issuingAuthority: "text", title: "text",
  currentOdometer: "number", serviceIntervalKm: "number", serviceIntervalMonths: "number",
  purchaseDate: "date", issueDate: "date", warrantyExpiry: "date",
  expiryDate: "date", nextServiceDate: "date", lastService: "date",
  notes: "textarea",
};

const REQUIRED_FIELDS = new Set(["make", "model", "owner", "holderName", "nextServiceDate", "expiryDate", "plate", "title"]);

// ========== SAMPLE DATA ==========
const TODAY = new Date("2026-04-19");
const buildSample = () => [
  { id: 1, type: "car_service",
    make: "Toyota", makeAr: "تويوتا", model: "Land Cruiser", modelAr: "لاند كروزر", year: 2020,
    plate: "12345", owner: "Abdulaziz", ownerAr: "عبدالعزيز",
    currentOdometer: 72400, odometerDate: "2026-04-01",
    serviceIntervalKm: 10000, serviceIntervalMonths: 6,
    purchaseDate: "2020-03-15", warrantyExpiry: "2025-03-15", nextServiceDate: "2026-04-06",
    selectedGarageIds: ["fast_fit_rai", "pro_tyre"],
    notes: "Use 5W-30 synthetic oil. Change every 10,000 km.",
    notesAr: "استخدم زيت 5W-30 صناعي. التغيير كل 10,000 كم.",
    services: [
      { id: 1, date: "2025-11-20", desc: "Oil change + all filters", descAr: "تغيير زيت وجميع الفلاتر", cost: 45, center: "Al-Sayer Toyota", centerAr: "السيارة تويوتا", odometer: 64000 },
      { id: 2, date: "2025-05-10", desc: "Front brake pads", descAr: "تيل فرامل أمامي", cost: 120, center: "Al-Sayer Toyota", centerAr: "السيارة تويوتا", odometer: 58200 },
    ], photos: 3 },
  { id: 2, type: "car_service",
    make: "Nissan", makeAr: "نيسان", model: "Patrol", modelAr: "باترول", year: 2022,
    plate: "67890", owner: "Hamed", ownerAr: "حامد",
    currentOdometer: 38500, odometerDate: "2026-04-10",
    serviceIntervalKm: 5000, serviceIntervalMonths: 4,
    purchaseDate: "2022-08-01", warrantyExpiry: "2027-08-01", nextServiceDate: "2026-04-23",
    selectedGarageIds: [],
    notes: "Service every 5,000 km per dealer.", notesAr: "صيانة كل 5,000 كم حسب الوكيل.",
    services: [{ id: 1, date: "2026-01-15", desc: "Oil + oil filter", descAr: "زيت + فلتر زيت", cost: 55, center: "Al-Babtain Nissan", centerAr: "البابطين نيسان", odometer: 34000 }],
    photos: 1 },
  { id: 3, type: "car_registration",
    plate: "12345", make: "Toyota", makeAr: "تويوتا", model: "Land Cruiser", modelAr: "لاند كروزر",
    owner: "Abdulaziz", ownerAr: "عبدالعزيز",
    issuingAuthority: "General Directorate of Traffic (MOI)", issuingAuthorityAr: "الإدارة العامة للمرور",
    expiryDate: "2026-04-30",
    notes: "Annual renewal. Via Sahel app or Mishref center.",
    notesAr: "تجديد سنوي. عبر تطبيق سهل أو مركز مشرف.", photos: 1 },
  { id: 4, type: "car_registration",
    plate: "67890", make: "Nissan", makeAr: "نيسان", model: "Patrol", modelAr: "باترول",
    owner: "Hamed", ownerAr: "حامد",
    issuingAuthority: "General Directorate of Traffic (MOI)", issuingAuthorityAr: "الإدارة العامة للمرور",
    expiryDate: "2027-02-15", notes: "", notesAr: "", photos: 0 },
  { id: 5, type: "civil_id",
    holderName: "Abdulaziz Hamed Alammar", holderNameAr: "عبدالعزيز حامد العمار",
    civilIdNumber: "289052400123", owner: "Abdulaziz", ownerAr: "عبدالعزيز",
    issueDate: "2021-05-15", expiryDate: "2026-05-15",
    notes: "Renew at PACI Mishref or online via Sahel.",
    notesAr: "التجديد من الهيئة العامة للمعلومات المدنية أو عبر سهل.", photos: 1 },
  { id: 6, type: "civil_id",
    holderName: "Hamed Alammar", holderNameAr: "حامد العمار",
    civilIdNumber: "268031100456", owner: "Hamed", ownerAr: "حامد",
    issueDate: "2022-01-10", expiryDate: "2027-01-10",
    notes: "", notesAr: "", photos: 1 },
  { id: 7, type: "civil_id",
    holderName: "Fatima Alammar", holderNameAr: "فاطمة العمار",
    civilIdNumber: "295072800789", owner: "Fatima", ownerAr: "فاطمة",
    issueDate: "2020-08-20", expiryDate: "2025-08-20",
    notes: "Already expired — renew ASAP.",
    notesAr: "منتهية — يجب التجديد فوراً.", photos: 0 },
  { id: 8, type: "passport",
    holderName: "Abdulaziz Hamed Alammar", holderNameAr: "عبدالعزيز حامد العمار",
    passportNumber: "A12345678", nationality: "Kuwaiti", nationalityAr: "كويتي",
    owner: "Abdulaziz", ownerAr: "عبدالعزيز",
    issueDate: "2021-06-01", expiryDate: "2026-06-01",
    notes: "Renew via MOI e-services before travel.",
    notesAr: "التجديد عبر خدمات الداخلية قبل السفر.", photos: 1 },
  { id: 9, type: "passport",
    holderName: "Hamed Alammar", holderNameAr: "حامد العمار",
    passportNumber: "A87654321", nationality: "Kuwaiti", nationalityAr: "كويتي",
    owner: "Hamed", ownerAr: "حامد",
    issueDate: "2023-03-15", expiryDate: "2028-03-15",
    notes: "", notesAr: "", photos: 1 },
  { id: 10, type: "driving_license",
    holderName: "Abdulaziz Hamed Alammar", holderNameAr: "عبدالعزيز حامد العمار",
    licenseNumber: "DL-289052-Q", owner: "Abdulaziz", ownerAr: "عبدالعزيز",
    issueDate: "2017-04-20", expiryDate: "2027-04-20",
    notes: "Renewable at GDT Mishref.",
    notesAr: "التجديد في المرور بمشرف.", photos: 0 },
  { id: 11, type: "ac",
    brand: "Gree", brandAr: "جري", model: "U-Crown 1.5T", modelAr: "يو كراون 1.5 طن",
    location: "Living Room", locationAr: "الصالة", tonnage: "1.5 ton",
    owner: "Fatima", ownerAr: "فاطمة",
    serviceIntervalMonths: 6,
    purchaseDate: "2021-06-10", warrantyExpiry: "2024-06-10", nextServiceDate: "2026-05-08",
    selectedGarageIds: ["cool_tech", "ac_master"],
    notes: "Filter cleaning every 3 months. Full service before summer.",
    notesAr: "تنظيف الفلتر كل 3 أشهر. صيانة شاملة قبل الصيف.",
    services: [{ id: 1, date: "2025-11-01", desc: "Filter clean + gas check", descAr: "تنظيف فلتر + فحص غاز", cost: 12, center: "Cool Tech", centerAr: "كول تك" }],
    photos: 0 },
  { id: 12, type: "elevator",
    brand: "Schindler", brandAr: "شيندلر",
    location: "Building — Salmiya", locationAr: "البرج — السالمية",
    serviceCompany: "Kuwait Elevators Co.", serviceCompanyAr: "شركة مصاعد الكويت",
    emergencyPhone: "+965 2571 5555",
    owner: "Family Building", ownerAr: "برج العائلة",
    serviceIntervalMonths: 3,
    lastService: "2026-01-15", nextServiceDate: "2026-05-01",
    selectedGarageIds: ["kw_elevators"],
    notes: "Quarterly service contract. Ends Dec 2026.",
    notesAr: "عقد صيانة ربع سنوي. ينتهي ديسمبر 2026.",
    services: [{ id: 1, date: "2026-01-15", desc: "Quarterly inspection", descAr: "فحص ربع سنوي", cost: 80, center: "Kuwait Elevators Co.", centerAr: "شركة مصاعد الكويت" }],
    photos: 0 },
  { id: 13, type: "appliance",
    applianceType: "Refrigerator", applianceTypeAr: "ثلاجة",
    brand: "LG", brandAr: "إل جي", model: "GR-B509", modelAr: "GR-B509",
    location: "Kitchen", locationAr: "المطبخ",
    owner: "Umm Abdulaziz", ownerAr: "أم عبدالعزيز",
    serviceIntervalMonths: 12,
    purchaseDate: "2019-02-20", warrantyExpiry: "2024-02-20", nextServiceDate: "2026-06-15",
    selectedGarageIds: [],
    notes: "", notesAr: "", services: [], photos: 0 },
  { id: 14, type: "appliance",
    applianceType: "Washing Machine", applianceTypeAr: "غسالة",
    brand: "Samsung", brandAr: "سامسونج", model: "WW90T", modelAr: "WW90T",
    location: "Laundry", locationAr: "غرفة الغسيل",
    owner: "Mariam", ownerAr: "مريم",
    serviceIntervalMonths: 6,
    purchaseDate: "2020-11-05", warrantyExpiry: "2022-11-05", nextServiceDate: "2026-04-15",
    selectedGarageIds: ["home_pro"],
    notes: "Descale every 6 months.", notesAr: "إزالة ترسبات كل 6 أشهر.",
    services: [{ id: 1, date: "2025-10-20", desc: "Descaling + drum belt check", descAr: "إزالة ترسبات + فحص سير", cost: 22, center: "Samsung Service", centerAr: "خدمة سامسونج" }],
    photos: 1 },
  { id: 15, type: "garden",
    location: "Main villa backyard", locationAr: "حوش البيت الرئيسي",
    area: "350 sqm", areaAr: "350 متر مربع",
    serviceCompany: "Green Gardens Kuwait", serviceCompanyAr: "الحدائق الخضراء",
    owner: "Family", ownerAr: "العائلة",
    serviceIntervalMonths: 1,
    lastService: "2026-03-10", nextServiceDate: "2026-04-25",
    selectedGarageIds: ["green_gardens", "desert_bloom"],
    notes: "Monthly trim, irrigation check. Palm trees need extra care in summer.",
    notesAr: "تشذيب شهري، فحص نظام الري. النخيل يحتاج عناية خاصة بالصيف.",
    services: [{ id: 1, date: "2026-03-10", desc: "Monthly trim + irrigation tune-up", descAr: "تشذيب شهري + ضبط الري", cost: 35, center: "Green Gardens", centerAr: "الحدائق الخضراء" }],
    photos: 0 },
  { id: 16, type: "appointment",
    title: "Dr. Al-Rashidi — Annual check-up",
    titleAr: "د. الرشيدي — الفحص السنوي",
    location: "Dar Al Shifa Hospital, Hawalli",
    locationAr: "مستشفى دار الشفاء، حولي",
    owner: "Abdulaziz", ownerAr: "عبدالعزيز",
    nextServiceDate: "2026-04-28",
    notes: "Fasting required. Bring last blood test results.",
    notesAr: "الصيام مطلوب. احضر نتائج تحليل الدم السابقة.",
    photos: 0 },
  { id: 17, type: "appointment",
    title: "Emirates flight EK 855 to Dubai",
    titleAr: "رحلة طيران الإمارات EK 855 إلى دبي",
    location: "KWI Terminal 4",
    locationAr: "مطار الكويت، صالة 4",
    owner: "Hamed", ownerAr: "حامد",
    nextServiceDate: "2026-05-10",
    notes: "Check-in closes 60 min before. Bring passport.",
    notesAr: "تسجيل الدخول يغلق قبل ساعة. احضر الجواز.",
    photos: 0 },
  { id: 18, type: "other",
    title: "Pay DEWA electricity bill",
    titleAr: "دفع فاتورة الكهرباء",
    owner: "Abdulaziz", ownerAr: "عبدالعزيز",
    nextServiceDate: "2026-04-25",
    notes: "Pay via Sahel app before disconnection notice.",
    notesAr: "الدفع عبر تطبيق سهل قبل إشعار القطع.",
    photos: 0 },
];

// ========== HELPERS ==========
const parseDate = (s) => new Date(s + "T00:00:00");
const daysDiff = (t) => Math.round((parseDate(t) - TODAY) / 86400000);
const addDaysISO = (iso, days) => {
  const d = parseDate(iso); d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const addMonthsISO = (iso, months) => {
  const d = parseDate(iso); d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
};
const getItemDate = (item) => item[ITEM_TYPES[item.type].dateField];
const getStatus = (item) => {
  const n = daysDiff(getItemDate(item));
  if (n < 0) return "overdue";
  if (n <= 30) return "due";
  return "ok";
};
const getItemName = (item, lang) => {
  const type = ITEM_TYPES[item.type];
  const fields = lang === "ar" ? {
    make: item.makeAr || item.make, model: item.modelAr || item.model, year: item.year,
    plate: item.plate, brand: item.brandAr || item.brand,
    location: item.locationAr || item.location,
    holderName: item.holderNameAr || item.holderName,
    applianceType: item.applianceTypeAr || item.applianceType,
    title: item.titleAr || item.title,
  } : item;
  return type.buildName(fields, lang) || "—";
};
const getItemOwner = (item, lang) => lang === "ar" ? (item.ownerAr || item.owner) : item.owner;
const formatDate = (s, lang) => {
  if (!s) return "—";
  return parseDate(s).toLocaleDateString(lang === "ar" ? "ar-KW" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" });
};
const formatKWD = (n, lang) => { const f = n.toFixed(3); return lang === "ar" ? `${f} د.ك` : `${f} KWD`; };
const formatNum = (n) => n.toLocaleString("en-US");
const statusMeta = {
  overdue: { bg: "#FEE2E2", fg: "#991B1B", icon: AlertCircle },
  due: { bg: "#FEF3C7", fg: "#92400E", icon: Clock },
  ok: { bg: "#DCFCE7", fg: "#166534", icon: Check },
};
const formatStatusText = (item, t) => {
  const d = daysDiff(getItemDate(item));
  if (d < 0) { const n = Math.abs(d); return `${n} ${n === 1 ? t.home.dayOverdue : t.home.daysOverdue}`; }
  if (d === 0) return t.home.today;
  if (d === 1) return t.home.tomorrow;
  if (d < 30) return t.home.inDays.replace("{n}", d);
  return t.home.inMonths.replace("{n}", Math.round(d / 30));
};

// ========== NEW v0.3 HELPERS ==========
const getOfficialDealer = (item) => {
  const type = ITEM_TYPES[item.type];
  if (!type.officialDealerCategory) return null;
  const brandKey = item[type.officialDealerKey];
  if (!brandKey) return null;
  return OFFICIAL_DEALERS_DB[type.officialDealerCategory]?.[brandKey] || null;
};
const getAvailableGarages = (item) => {
  const type = ITEM_TYPES[item.type];
  if (!type.garageCategory) return [];
  return RECOMMENDED_GARAGES.filter((g) => g.category === type.garageCategory);
};
const getSelectedGarages = (item) => {
  const ids = item.selectedGarageIds || [];
  return ids.map((id) => RECOMMENDED_GARAGES.find((g) => g.id === id)).filter(Boolean);
};
const getOdometerInfo = (item) => {
  const type = ITEM_TYPES[item.type];
  if (!type.hasOdometer || !item.currentOdometer) return null;
  const services = (item.services || []).slice().sort((a, b) => parseDate(b.date) - parseDate(a.date));
  const lastServiced = services.find((s) => typeof s.odometer === "number");

  // Compute average km/day from service history (between two most recent services)
  let avgKmPerDay = null;
  const withOdo = services.filter((s) => typeof s.odometer === "number");
  if (withOdo.length >= 2) {
    const newest = withOdo[0], older = withOdo[1];
    const days = (parseDate(newest.date) - parseDate(older.date)) / 86400000;
    if (days > 0) avgKmPerDay = (newest.odometer - older.odometer) / days;
  } else if (withOdo.length === 1 && item.odometerDate) {
    const days = (parseDate(item.odometerDate) - parseDate(withOdo[0].date)) / 86400000;
    if (days > 0) avgKmPerDay = (item.currentOdometer - withOdo[0].odometer) / days;
  }
  // Fallback: typical Kuwait daily driving
  if (!avgKmPerDay || avgKmPerDay <= 0) avgKmPerDay = 50;

  // Estimate today's odometer based on daily average
  const daysSinceRecorded = item.odometerDate
    ? Math.max(0, (TODAY - parseDate(item.odometerDate)) / 86400000)
    : 0;
  const estimatedCurrent = Math.round(item.currentOdometer + avgKmPerDay * daysSinceRecorded);

  if (!lastServiced || !item.serviceIntervalKm) {
    return {
      current: item.currentOdometer, estimatedCurrent,
      avgKmPerDay: Math.round(avgKmPerDay),
      daysSinceRecorded: Math.round(daysSinceRecorded), hasLast: false,
    };
  }
  const driven = estimatedCurrent - lastServiced.odometer;
  const toGo = item.serviceIntervalKm - driven;
  const pct = Math.min(100, Math.max(0, (driven / item.serviceIntervalKm) * 100));
  return {
    current: item.currentOdometer, estimatedCurrent,
    lastServiceOdometer: lastServiced.odometer,
    lastServiceDate: lastServiced.date, interval: item.serviceIntervalKm,
    avgKmPerDay: Math.round(avgKmPerDay),
    daysSinceRecorded: Math.round(daysSinceRecorded),
    driven, toGo, pct,
    status: toGo < 0 ? "overdue" : toGo <= 1500 ? "due" : "ok",
    hasLast: true,
  };
};
const getIntervalText = (item, t) => {
  const parts = [];
  if (item.serviceIntervalKm) parts.push(t.device.everyKm.replace("{n}", formatNum(item.serviceIntervalKm)));
  if (item.serviceIntervalMonths) parts.push(t.device.everyMonths.replace("{n}", item.serviceIntervalMonths));
  return parts.join(" · ");
};
const getNotificationSchedule = (item, lang) => {
  const cadence = NOTIFICATION_CADENCES[item.type] || [];
  const dueDate = getItemDate(item);
  if (!dueDate) return [];
  return cadence.map((daysBefore) => {
    const fireDate = addDaysISO(dueDate, -daysBefore);
    return {
      daysBefore, fireDate,
      fireDateFormatted: formatDate(fireDate, lang),
      passed: daysDiff(fireDate) < 0,
    };
  });
};
const needsSummerAlert = (item) => {
  const type = ITEM_TYPES[item.type];
  if (!type.hasSummerAlert) return false;
  const month = TODAY.getMonth(), day = TODAY.getDate();
  const inWindow = (month === 3 && day >= 15) || month === 4;
  if (!inWindow) return false;
  const services = item.services || [];
  if (services.length === 0) return true;
  const latest = services.sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];
  const cutoff = new Date(`${TODAY.getFullYear() - 1}-09-01T00:00:00`);
  return parseDate(latest.date) < cutoff;
};

// Merge curated + custom garages for an item type
const getAllAvailableGarages = (item, customGarages) => {
  const type = ITEM_TYPES[item.type];
  if (!type.garageCategory) return { curated: [], custom: [] };
  return {
    curated: RECOMMENDED_GARAGES.filter((g) => g.category === type.garageCategory),
    custom: (customGarages || []).filter((g) => g.category === type.garageCategory),
  };
};

const getSelectedGaragesCombined = (item, customGarages) => {
  const ids = item.selectedGarageIds || [];
  const all = [...RECOMMENDED_GARAGES, ...(customGarages || [])];
  return ids.map((id) => all.find((g) => g.id === id)).filter(Boolean);
};

// Calendar helpers
const getCalendarGrid = (year, month) => {
  // month: 0-indexed. Returns 6x7 grid of { date, inMonth, isToday }
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay(); // 0=Sun
  const cells = [];
  // Previous month fill
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ date: d, inMonth: false, iso: d.toISOString().slice(0, 10) });
  }
  // Current month
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(year, month, d);
    cells.push({ date: dt, inMonth: true, iso: dt.toISOString().slice(0, 10) });
  }
  // Fill remainder to 42 cells (6 weeks)
  let next = 1;
  while (cells.length < 42) {
    const d = new Date(year, month + 1, next++);
    cells.push({ date: d, inMonth: false, iso: d.toISOString().slice(0, 10) });
  }
  const todayISO = TODAY.toISOString().slice(0, 10);
  return cells.map((c) => ({ ...c, isToday: c.iso === todayISO }));
};

const getItemsForDate = (devices, iso) => devices.filter((d) => getItemDate(d) === iso);

const getMonthTaskDates = (devices) => {
  const map = {};
  devices.forEach((d) => {
    const iso = getItemDate(d);
    if (!iso) return;
    if (!map[iso]) map[iso] = [];
    map[iso].push(d);
  });
  return map;
};

// ========== STYLES ==========
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap');
    .fm-root, .fm-root * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
    .fm-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; letter-spacing: -0.01em; touch-action: manipulation; }
    .fm-root[dir="rtl"] { font-family: 'Tajawal', system-ui, sans-serif; letter-spacing: 0; }
    .fm-serif { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.02em; }
    .fm-root[dir="rtl"] .fm-serif { font-family: 'Tajawal', system-ui, sans-serif; font-weight: 800; letter-spacing: 0; }
    input, textarea { user-select: text; }
    .fm-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
    .fm-scroll::-webkit-scrollbar { display: none; }
    .fm-scroll { scrollbar-width: none; }
    .fm-tap { transition: transform 120ms cubic-bezier(0.2, 0, 0.2, 1), background 120ms, box-shadow 150ms; }
    .fm-tap:active { transform: scale(0.96); }
    .fm-tap-light:active { background: rgba(0,0,0,0.04); transform: scale(0.98); }
    .fm-card-tap { transition: transform 150ms cubic-bezier(0.2, 0, 0.2, 1), box-shadow 150ms; }
    .fm-card-tap:active { transform: scale(0.985); box-shadow: 0 2px 6px rgba(26,24,20,0.10); }
    @keyframes fm-slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fm-modal-up { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fm-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes fm-backdrop { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fm-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fm-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.25); opacity: 0.65; } }
    @keyframes fm-stagger-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fm-screen { animation: fm-slide-up 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    .fm-modal { animation: fm-modal-up 300ms cubic-bezier(0.2, 0.85, 0.2, 1) both; }
    .fm-sheet { animation: fm-sheet-up 320ms cubic-bezier(0.2, 0.85, 0.2, 1) both; }
    .fm-backdrop { animation: fm-backdrop 200ms ease both; }
    .fm-fade { animation: fm-fade 200ms ease both; }
    .fm-pulse { animation: fm-pulse 1.8s ease-in-out infinite; }
    .fm-stagger > * { animation: fm-stagger-in 350ms cubic-bezier(0.2, 0.9, 0.3, 1) both; }
    .fm-stagger > *:nth-child(1) { animation-delay: 0ms; } .fm-stagger > *:nth-child(2) { animation-delay: 35ms; }
    .fm-stagger > *:nth-child(3) { animation-delay: 70ms; } .fm-stagger > *:nth-child(4) { animation-delay: 105ms; }
    .fm-stagger > *:nth-child(5) { animation-delay: 140ms; } .fm-stagger > *:nth-child(6) { animation-delay: 175ms; }
    .fm-stagger > *:nth-child(7) { animation-delay: 210ms; } .fm-stagger > *:nth-child(n+8) { animation-delay: 245ms; }
    .fm-num { font-variant-numeric: tabular-nums; }
    .fm-input:focus { border-color: #1E4D3F !important; background: #FFFFFF !important; }
  `}</style>
);

// ========== ITEM CARD ==========
const ItemCard = ({ item, t, lang, dir, onClick }) => {
  const type = ITEM_TYPES[item.type];
  const Icon = type.icon;
  const status = getStatus(item);
  const sMeta = statusMeta[status];
  const StatusIcon = sMeta.icon;
  const odo = getOdometerInfo(item);

  return (
    <button onClick={onClick} className="fm-card-tap" style={{
      width: "100%", background: "#FFFFFF", border: "1px solid #EEE6D7",
      borderRadius: 18, padding: 14, display: "flex", flexDirection: "column",
      gap: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "start",
      boxShadow: "0 1px 2px rgba(26,24,20,0.04)",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%",
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: type.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={23} color={type.fg} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: type.fg, textTransform: "uppercase",
            letterSpacing: 0.4, marginBottom: 2 }}>{t.types[item.type].label}</div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1A1814", marginBottom: 2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {getItemName(item, lang)}
          </div>
          <div style={{ fontSize: 11.5, color: "#6B6359", display: "flex", alignItems: "center", gap: 5,
            justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
            <User size={11} strokeWidth={2.2} />
            {getItemOwner(item, lang)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column",
          alignItems: dir === "rtl" ? "flex-start" : "flex-end", gap: 4, flexShrink: 0 }}>
          <div style={{ background: sMeta.bg, color: sMeta.fg, padding: "4px 9px",
            borderRadius: 100, fontSize: 10.5, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <StatusIcon size={10} strokeWidth={2.5} />
            <span className="fm-num">{formatStatusText(item, t)}</span>
          </div>
          <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 500 }} className="fm-num">
            {formatDate(getItemDate(item), lang)}
          </div>
        </div>
      </div>
      {odo && odo.hasLast && (
        <div style={{ width: "100%", textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 10.5, color: "#6B6359", marginBottom: 4,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Gauge size={10} strokeWidth={2.3} />
              <span className="fm-num" style={{ fontWeight: 700 }}>{formatNum(odo.driven)}</span>
              <span>/ {formatNum(odo.interval)} km</span>
            </span>
            <span className="fm-num" style={{ fontWeight: 700,
              color: odo.status === "overdue" ? "#991B1B" : odo.status === "due" ? "#92400E" : "#166534" }}>
              {odo.toGo < 0
                ? `${formatNum(Math.abs(odo.toGo))} ${t.home.kmOverdue}`
                : `${formatNum(odo.toGo)} ${t.home.kmToGo}`}
            </span>
          </div>
          <div style={{ height: 5, background: "#F0EAD9", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${odo.pct}%`,
              background: odo.status === "overdue" ? "#DC2626" : odo.status === "due" ? "#D97706" : "#16A34A",
              borderRadius: 3, transition: "width 700ms cubic-bezier(0.2, 0.9, 0.3, 1)" }} />
          </div>
        </div>
      )}
    </button>
  );
};

// ========== WELCOME ==========
const WelcomeScreen = ({ t, dir, lang, onStart, onToggleLang }) => (
  <div className="fm-screen" style={{
    height: "100%", display: "flex", flexDirection: "column",
    background: "linear-gradient(170deg, #F5F0E8 0%, #EFE3D2 50%, #E6CDA8 100%)",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220,
      background: "radial-gradient(circle, rgba(201,123,43,0.38), transparent 70%)",
      filter: "blur(15px)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: -100, left: -80, width: 260, height: 260,
      background: "radial-gradient(circle, rgba(30,77,63,0.25), transparent 70%)",
      filter: "blur(20px)", pointerEvents: "none" }} />
    <button onClick={onToggleLang} className="fm-tap" style={{
      position: "absolute", top: 18, [dir === "rtl" ? "left" : "right"]: 18,
      background: "rgba(255,255,255,0.75)", backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.9)", padding: "8px 14px",
      borderRadius: 100, fontSize: 13, fontWeight: 700, color: "#1E4D3F",
      display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
      zIndex: 2, fontFamily: "inherit" }}>
      <Languages size={14} />
      {lang === "en" ? "العربية" : "English"}
    </button>
    <div style={{ flex: 1, padding: "80px 28px 0", display: "flex",
      flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22,
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "#1E4D3F",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 20px -6px rgba(30,77,63,0.5)" }}>
          <Wrench size={22} color="#F5F0E8" strokeWidth={2.2} />
        </div>
        <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
          <div className="fm-serif" style={{ fontSize: 20,
            fontStyle: lang === "en" ? "italic" : "normal",
            fontWeight: 600, color: "#1A1814", lineHeight: 1 }}>{t.appName}</div>
          <div style={{ fontSize: 11, color: "#6B6359", fontWeight: 600, marginTop: 3 }}>{t.brandTag}</div>
        </div>
      </div>
      <div style={{ fontSize: 14, color: "#9A4A1A", fontWeight: 700, marginBottom: 8 }}>{t.welcome.hello}</div>
      <h1 className="fm-serif" style={{ fontSize: 30, lineHeight: 1.15, fontWeight: 500,
        color: "#1A1814", margin: 0, fontStyle: lang === "en" ? "italic" : "normal" }}>{t.welcome.title}</h1>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#5B5140", marginTop: 14, marginBottom: 20 }}>{t.welcome.subtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="fm-stagger">
        {[{ icon: User, ...t.welcome.features[0] }, { icon: BellRing, ...t.welcome.features[1] },
          { icon: Star, ...t.welcome.features[2] }].map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: "12px 14px",
              display: "flex", gap: 12, alignItems: "center",
              flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1E4D3F",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} color="#F5F0E8" strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, textAlign: dir === "rtl" ? "right" : "left" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1814", marginBottom: 1 }}>{f.t}</div>
                <div style={{ fontSize: 12, color: "#6B6359", lineHeight: 1.4 }}>{f.s}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ padding: "20px 28px 30px", position: "relative", zIndex: 1 }}>
      <button onClick={onStart} className="fm-tap" style={{
        width: "100%", padding: 16, background: "#1E4D3F", color: "#F5F0E8",
        border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700,
        cursor: "pointer", boxShadow: "0 12px 28px -8px rgba(30,77,63,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: "inherit" }}>
        {t.welcome.cta}
        <ArrowRight size={18} style={{ transform: dir === "rtl" ? "rotate(180deg)" : "none" }} />
      </button>
      <button onClick={onStart} className="fm-tap-light" style={{
        width: "100%", background: "transparent", border: "none", color: "#6B6359",
        fontSize: 13, padding: 14, cursor: "pointer", fontFamily: "inherit",
        fontWeight: 600, borderRadius: 10 }}>{t.welcome.skip}</button>
    </div>
  </div>
);


// ========== FILTER SHEET ==========
const FilterSheet = ({ t, lang, dir, devices, filters, setFilters, onClose }) => {
  const [local, setLocal] = useState(filters);
  const allOwners = useMemo(() =>
    Array.from(new Set(devices.map((d) => d.owner))).sort(), [devices]);
  const toggle = (key, value) => {
    setLocal((prev) => {
      const curr = prev[key] || [];
      return { ...prev, [key]: curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value] };
    });
  };
  const clear = () => setLocal({ status: [], types: [], owners: [] });
  const apply = () => { setFilters(local); onClose(); };
  const activeCount = (local.status?.length || 0) + (local.types?.length || 0) + (local.owners?.length || 0);
  const personalTypes = Object.keys(ITEM_TYPES).filter((k) => ITEM_TYPES[k].section === "personal");
  const homeTypes = Object.keys(ITEM_TYPES).filter((k) => ITEM_TYPES[k].section === "home");
  const reminderTypes = Object.keys(ITEM_TYPES).filter((k) => ITEM_TYPES[k].section === "reminders");

  const Checkbox = ({ checked, onClick, children, icon: Icon, iconBg, iconFg }) => (
    <button onClick={onClick} className="fm-tap-light" style={{
      width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
      background: checked ? "#F0EAD9" : "transparent", border: "none", borderRadius: 10,
      cursor: "pointer", fontFamily: "inherit", textAlign: "start",
      flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
      {Icon && (
        <div style={{ width: 30, height: 30, borderRadius: 8, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={15} color={iconFg} strokeWidth={2} />
        </div>
      )}
      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1A1814",
        textAlign: dir === "rtl" ? "right" : "left" }}>{children}</div>
      <div style={{ width: 22, height: 22, borderRadius: 7,
        border: checked ? "none" : "1.5px solid #D4C7B0",
        background: checked ? "#1E4D3F" : "#FFFFFF",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        transition: "all 150ms" }}>
        {checked && <Check size={14} color="#F5F0E8" strokeWidth={3} />}
      </div>
    </button>
  );

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9A8E7A",
      textTransform: "uppercase", letterSpacing: 0.6, padding: "14px 14px 6px",
      textAlign: dir === "rtl" ? "right" : "left" }}>{children}</div>
  );

  return (
    <>
      <div onClick={onClose} className="fm-backdrop" style={{
        position: "absolute", inset: 0, background: "rgba(26,24,20,0.5)",
        backdropFilter: "blur(4px)", zIndex: 10 }} />
      <div className="fm-sheet" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 11,
        background: "#F5F0E8", borderRadius: "22px 22px 0 0",
        maxHeight: "85%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: "#D4C7B0", borderRadius: 2 }} />
        </div>
        <div style={{ padding: "4px 16px 12px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <div className="fm-serif" style={{ fontSize: 20, fontWeight: 600, color: "#1A1814",
            fontStyle: lang === "en" ? "italic" : "normal" }}>{t.filterSheet.title}</div>
          {activeCount > 0 && (
            <button onClick={clear} className="fm-tap-light" style={{
              background: "transparent", border: "none", fontSize: 13, fontWeight: 700,
              color: "#9A4A1A", cursor: "pointer", fontFamily: "inherit", padding: "6px 10px",
              borderRadius: 8 }}>{t.home.clearAll}</button>
          )}
        </div>
        <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "0 10px 6px" }}>
          <SectionLabel>{t.filterSheet.sectionStatus}</SectionLabel>
          <Checkbox checked={local.status?.includes("overdue")} onClick={() => toggle("status", "overdue")}
            icon={AlertCircle} iconBg="#FEE2E2" iconFg="#991B1B">{t.home.overdue}</Checkbox>
          <Checkbox checked={local.status?.includes("due")} onClick={() => toggle("status", "due")}
            icon={Clock} iconBg="#FEF3C7" iconFg="#92400E">{t.home.dueSoon}</Checkbox>
          <SectionLabel>{t.filterSheet.sectionPersonal}</SectionLabel>
          {personalTypes.map((k) => {
            const type = ITEM_TYPES[k];
            return (<Checkbox key={k} checked={local.types?.includes(k)} onClick={() => toggle("types", k)}
              icon={type.icon} iconBg={type.bg} iconFg={type.fg}>{t.types[k].label}</Checkbox>);
          })}
          <SectionLabel>{t.filterSheet.sectionHome}</SectionLabel>
          {homeTypes.map((k) => {
            const type = ITEM_TYPES[k];
            return (<Checkbox key={k} checked={local.types?.includes(k)} onClick={() => toggle("types", k)}
              icon={type.icon} iconBg={type.bg} iconFg={type.fg}>{t.types[k].label}</Checkbox>);
          })}
          <SectionLabel>{t.filterSheet.sectionReminders}</SectionLabel>
          {reminderTypes.map((k) => {
            const type = ITEM_TYPES[k];
            return (<Checkbox key={k} checked={local.types?.includes(k)} onClick={() => toggle("types", k)}
              icon={type.icon} iconBg={type.bg} iconFg={type.fg}>{t.types[k].label}</Checkbox>);
          })}
          <SectionLabel>{t.filterSheet.sectionOwner}</SectionLabel>
          {allOwners.map((o) => {
            const owner = devices.find((d) => d.owner === o);
            const ownerDisplay = lang === "ar" ? (owner?.ownerAr || o) : o;
            return (<Checkbox key={o} checked={local.owners?.includes(o)} onClick={() => toggle("owners", o)}
              icon={User} iconBg="#F5F0E8" iconFg="#1E4D3F">{ownerDisplay}</Checkbox>);
          })}
        </div>
        <div style={{ padding: "10px 16px 22px", flexShrink: 0,
          borderTop: "1px solid #E8DFD0", background: "#F5F0E8" }}>
          <button onClick={apply} className="fm-tap" style={{
            width: "100%", background: "#1E4D3F", color: "#F5F0E8",
            border: "none", padding: 14, borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 10px 20px -8px rgba(30,77,63,0.4)" }}>
            {t.home.apply}{activeCount > 0 ? ` · ${activeCount}` : ""}
          </button>
        </div>
      </div>
    </>
  );
};

// ========== GARAGE SELECTOR SHEET ==========
const GarageSelectorSheet = ({ t, lang, dir, item, customGarages, onSave, onAddCustom, onRemoveCustom, onClose }) => {
  const [selected, setSelected] = useState(new Set(item.selectedGarageIds || []));
  const { curated, custom } = getAllAvailableGarages(item, customGarages);
  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const apply = () => { onSave(Array.from(selected)); onClose(); };

  const renderGarageRow = (g, isCustom) => {
    const isSelected = selected.has(g.id);
    return (
      <button key={g.id} onClick={() => toggle(g.id)} className="fm-tap-light" style={{
        width: "100%", padding: 12, display: "flex", alignItems: "center", gap: 12,
        background: isSelected ? "#F0EAD9" : "#FFFFFF",
        border: isSelected ? "1.5px solid #1E4D3F" : "1px solid #EEE6D7",
        borderRadius: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "start",
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ flex: 1, textAlign: dir === "rtl" ? "right" : "left", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1814",
              flex: 1, textAlign: dir === "rtl" ? "right" : "left",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {lang === "ar" ? (g.nameAr || g.name) : g.name}
            </div>
            {isCustom && (
              <span style={{ background: "#DBEAFE", color: "#1E40AF",
                fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6,
                textTransform: "uppercase", letterSpacing: 0.3, flexShrink: 0 }}>★ MINE</span>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: "#6B6359", marginBottom: 2,
            display: "flex", alignItems: "center", gap: 4,
            flexDirection: dir === "rtl" ? "row-reverse" : "row",
            justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
            <MapPin size={10} />
            {lang === "ar" ? (g.locationAr || g.location) : g.location}
            <span style={{ margin: "0 4px" }}>·</span>
            <span className="fm-num">{g.phone}</span>
          </div>
          {g.specialty && (
            <div style={{ fontSize: 11, color: "#9A8E7A", fontStyle: "italic" }}>
              {lang === "ar" ? (g.specialtyAr || g.specialty) : g.specialty}
            </div>
          )}
        </div>
        {isCustom && (
          <button onClick={(e) => { e.stopPropagation(); onRemoveCustom(g.id); }}
            className="fm-tap-light" style={{
              background: "transparent", border: "none", padding: 6, cursor: "pointer",
              color: "#B91C1C", display: "flex", alignItems: "center" }}>
            <Trash2 size={14} />
          </button>
        )}
        <div style={{ width: 22, height: 22, borderRadius: 7,
          border: isSelected ? "none" : "1.5px solid #D4C7B0",
          background: isSelected ? "#1E4D3F" : "#FFFFFF",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {isSelected && <Check size={14} color="#F5F0E8" strokeWidth={3} />}
        </div>
      </button>
    );
  };

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9A8E7A",
      textTransform: "uppercase", letterSpacing: 0.6, padding: "14px 4px 6px",
      textAlign: dir === "rtl" ? "right" : "left" }}>{children}</div>
  );

  return (
    <>
      <div onClick={onClose} className="fm-backdrop" style={{
        position: "absolute", inset: 0, background: "rgba(26,24,20,0.5)",
        backdropFilter: "blur(4px)", zIndex: 20 }} />
      <div className="fm-sheet" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 21,
        background: "#F5F0E8", borderRadius: "22px 22px 0 0",
        maxHeight: "88%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: "#D4C7B0", borderRadius: 2 }} />
        </div>
        <div style={{ padding: "4px 20px 14px", flexShrink: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
          <div className="fm-serif" style={{ fontSize: 20, fontWeight: 600, color: "#1A1814",
            fontStyle: lang === "en" ? "italic" : "normal", marginBottom: 4 }}>{t.garageSheet.title}</div>
          <div style={{ fontSize: 12.5, color: "#6B6359", lineHeight: 1.4 }}>{t.garageSheet.subtitle}</div>
        </div>
        <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "0 14px 6px" }}>
          {curated.length === 0 && custom.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#6B6359",
              background: "#FFFFFF", borderRadius: 14, border: "1px dashed #D4C7B0", marginBottom: 12 }}>
              <Info size={24} style={{ opacity: 0.4, marginBottom: 8 }} />
              <div style={{ fontSize: 13 }}>{t.garageSheet.emptyCategory}</div>
            </div>
          ) : (
            <>
              {custom.length > 0 && (
                <>
                  <SectionLabel>{t.customGarage.myGarages}</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {custom.map((g) => renderGarageRow(g, true))}
                  </div>
                </>
              )}
              {curated.length > 0 && (
                <>
                  <SectionLabel>{t.customGarage.curated}</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {curated.map((g) => renderGarageRow(g, false))}
                  </div>
                </>
              )}
            </>
          )}
          <button onClick={onAddCustom} className="fm-tap" style={{
            width: "100%", marginTop: 14, padding: "14px 12px",
            background: "#FFFFFF", border: "1.5px dashed #1E4D3F",
            borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            color: "#1E4D3F", fontSize: 13.5, fontWeight: 700 }}>
            <Plus size={16} strokeWidth={2.5} />
            {t.customGarage.addNew}
          </button>
        </div>
        <div style={{ padding: "10px 16px 22px", flexShrink: 0,
          borderTop: "1px solid #E8DFD0", background: "#F5F0E8" }}>
          <button onClick={apply} className="fm-tap" style={{
            width: "100%", background: "#1E4D3F", color: "#F5F0E8",
            border: "none", padding: 14, borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 10px 20px -8px rgba(30,77,63,0.4)" }}>
            {t.garageSheet.done}{selected.size > 0 ? ` · ${t.garageSheet.selectedCount.replace("{n}", selected.size)}` : ""}
          </button>
        </div>
      </div>
    </>
  );
};


// ========== HOME ==========
const ActiveChip = ({ children, onRemove }) => (
  <button onClick={onRemove} className="fm-tap" style={{
    background: "#FFF4E2", border: "1px solid #F5E5C8",
    borderRadius: 100, padding: "5px 9px 5px 12px",
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 700, color: "#9A4A1A",
    cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
    {children}
    <X size={12} strokeWidth={2.8} />
  </button>
);

const StatBlock = ({ count, label, color, active, onClick }) => (
  <button onClick={onClick} className="fm-tap" style={{
    flex: 1, background: active ? "#1E4D3F" : "#FFFFFF",
    border: active ? "1.5px solid #1E4D3F" : "1px solid #E8DFD0",
    borderRadius: 14, padding: "12px 10px", textAlign: "start",
    cursor: "pointer", fontFamily: "inherit" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 10.5, fontWeight: 700,
        color: active ? "rgba(245,240,232,0.75)" : "#6B6359",
        textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
    </div>
    <div className="fm-serif fm-num" style={{ fontSize: 28, fontWeight: 600,
      color: active ? "#F5F0E8" : "#1A1814", lineHeight: 1 }}>{count}</div>
  </button>
);

const EmptyState = ({ t, onAdd }) => (
  <div style={{ padding: "32px 20px 36px", textAlign: "center", background: "#FFFFFF",
    border: "1.5px dashed #D4C7B0", borderRadius: 20, marginTop: 10 }}>
    <div style={{ width: 68, height: 68, borderRadius: 20,
      background: "linear-gradient(135deg, #FCE7D8, #F5D0A8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 14px" }}>
      <Sparkles size={30} color="#9A4A1A" strokeWidth={2} />
    </div>
    <div className="fm-serif" style={{ fontSize: 20, fontWeight: 600, color: "#1A1814",
      marginBottom: 6, fontStyle: "italic" }}>{t.home.empty}</div>
    <div style={{ fontSize: 13, color: "#6B6359", marginBottom: 20, lineHeight: 1.5, padding: "0 12px" }}>
      {t.home.emptySub}
    </div>
    <button onClick={onAdd} className="fm-tap" style={{
      background: "#1E4D3F", color: "#F5F0E8", border: "none",
      padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700,
      cursor: "pointer", fontFamily: "inherit", display: "inline-flex",
      alignItems: "center", gap: 7 }}>
      <Plus size={16} strokeWidth={2.5} />
      {t.home.addFirst}
    </button>
  </div>
);

const HomeScreen = ({ t, lang, dir, devices, onOpenDevice, onAdd, filters, setFilters, search, setSearch, onOpenFilter }) => {
  const counts = useMemo(() => {
    const c = { overdue: 0, due: 0, ok: 0 };
    devices.forEach((d) => c[getStatus(d)]++);
    return c;
  }, [devices]);

  const filtered = useMemo(() => {
    let list = [...devices];
    if (filters.status?.length) list = list.filter((d) => filters.status.includes(getStatus(d)));
    if (filters.types?.length) list = list.filter((d) => filters.types.includes(d.type));
    if (filters.owners?.length) list = list.filter((d) => filters.owners.includes(d.owner));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => {
        const name = getItemName(d, lang).toLowerCase();
        const nameEn = getItemName(d, "en").toLowerCase();
        const owner = (d.owner || "").toLowerCase();
        const ownerAr = d.ownerAr || "";
        return name.includes(q) || nameEn.includes(q) || owner.includes(q) || ownerAr.includes(search);
      });
    }
    list.sort((a, b) => {
      const order = { overdue: 0, due: 1, ok: 2 };
      const sa = order[getStatus(a)], sb = order[getStatus(b)];
      if (sa !== sb) return sa - sb;
      return parseDate(getItemDate(a)) - parseDate(getItemDate(b));
    });
    return list;
  }, [devices, filters, search, lang]);

  const activeFilterCount = (filters.status?.length || 0) + (filters.types?.length || 0) + (filters.owners?.length || 0);

  return (
    <div className="fm-screen" style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F5F0E8" }}>
      <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: 10, flexShrink: 0,
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ flex: 1, minWidth: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontSize: 12, color: "#6B6359", fontWeight: 700, marginBottom: 2 }}>{t.home.greet}</div>
          <div className="fm-serif" style={{ fontSize: 22, fontWeight: 500, color: "#1A1814",
            fontStyle: lang === "en" ? "italic" : "normal", lineHeight: 1.15 }}>{t.home.sub}</div>
        </div>
        <button onClick={onAdd} className="fm-tap" style={{
          width: 44, height: 44, borderRadius: 14, background: "#1E4D3F", color: "#F5F0E8",
          border: "none", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0, boxShadow: "0 6px 14px -4px rgba(30,77,63,0.45)" }}>
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "0 20px 90px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12,
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} color="#6B6359" style={{
              position: "absolute", top: "50%",
              [dir === "rtl" ? "right" : "left"]: 14, transform: "translateY(-50%)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t.home.search} className="fm-input"
              style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E8DFD0",
                borderRadius: 14, padding: dir === "rtl" ? "12px 40px 12px 14px" : "12px 14px 12px 40px",
                fontSize: 13.5, color: "#1A1814", fontFamily: "inherit", outline: "none" }} />
          </div>
          <button onClick={onOpenFilter} className="fm-tap" style={{
            background: activeFilterCount > 0 ? "#1E4D3F" : "#FFFFFF",
            color: activeFilterCount > 0 ? "#F5F0E8" : "#1A1814",
            border: activeFilterCount > 0 ? "1.5px solid #1E4D3F" : "1px solid #E8DFD0",
            borderRadius: 14, padding: "0 14px", display: "flex", alignItems: "center",
            gap: 7, cursor: "pointer", fontFamily: "inherit", fontSize: 13.5, fontWeight: 700,
            flexShrink: 0 }}>
            <SlidersHorizontal size={16} strokeWidth={2.3} />
            {activeFilterCount > 0 && (
              <span style={{ background: "rgba(245,240,232,0.25)", padding: "2px 7px",
                borderRadius: 10, fontSize: 11, fontWeight: 800 }} className="fm-num">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {activeFilterCount > 0 && (
          <div className="fm-scroll" style={{ display: "flex", gap: 6, marginBottom: 12,
            overflow: "auto", paddingBottom: 2,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            {filters.status?.map((s) => (
              <ActiveChip key={s} onRemove={() => setFilters((f) => ({ ...f, status: f.status.filter((x) => x !== s) }))}>
                {s === "overdue" ? t.home.overdue : t.home.dueSoon}
              </ActiveChip>
            ))}
            {filters.types?.map((tp) => (
              <ActiveChip key={tp} onRemove={() => setFilters((f) => ({ ...f, types: f.types.filter((x) => x !== tp) }))}>
                {t.types[tp].label}
              </ActiveChip>
            ))}
            {filters.owners?.map((o) => {
              const owner = devices.find((d) => d.owner === o);
              return (
                <ActiveChip key={o} onRemove={() => setFilters((f) => ({ ...f, owners: f.owners.filter((x) => x !== o) }))}>
                  {lang === "ar" ? (owner?.ownerAr || o) : o}
                </ActiveChip>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <StatBlock count={counts.overdue} label={t.home.overdue} color="#DC2626"
            active={filters.status?.includes("overdue") && filters.status.length === 1}
            onClick={() => setFilters((f) => ({ ...f, status: f.status?.includes("overdue") ? [] : ["overdue"] }))} />
          <StatBlock count={counts.due} label={t.home.dueSoon} color="#D97706"
            active={filters.status?.includes("due") && filters.status.length === 1}
            onClick={() => setFilters((f) => ({ ...f, status: f.status?.includes("due") ? [] : ["due"] }))} />
          <StatBlock count={counts.ok} label={t.home.onTrack} color="#16A34A"
            active={false}
            onClick={() => setFilters({ status: [], types: [], owners: [] })} />
        </div>

        {filtered.length === 0 && devices.length === 0 ? (
          <EmptyState t={t} onAdd={onAdd} />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B6359",
            background: "#FFFFFF", borderRadius: 16, border: "1px dashed #D4C7B0" }}>
            <Search size={28} style={{ opacity: 0.4, marginBottom: 10 }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t.home.noResults}</div>
          </div>
        ) : (
          <div className="fm-stagger" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {filtered.map((d) => (
              <ItemCard key={d.id} item={d} t={t} lang={lang} dir={dir}
                onClick={() => onOpenDevice(d.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ========== BOTTOM NAV ==========
const BottomNav = ({ t, active, onNav, dir, alertCount }) => {
  const items = [
    { key: "home", label: t.nav.home, icon: HomeIcon },
    { key: "calendar", label: t.nav.calendar, icon: Calendar },
    { key: "alerts", label: t.nav.alerts, icon: Bell, badge: alertCount },
    { key: "settings", label: t.nav.settings, icon: SettingsIcon },
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(245, 240, 232, 0.94)", backdropFilter: "blur(14px)",
      borderTop: "1px solid #E8DFD0", padding: "6px 6px 14px",
      display: "flex", justifyContent: "space-around",
      flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button key={item.key} onClick={() => onNav(item.key)} className="fm-tap-light" style={{
            flex: 1, background: "transparent", border: "none", cursor: "pointer",
            padding: "10px 4px 6px", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, fontFamily: "inherit",
            color: isActive ? "#1E4D3F" : "#6B6359",
            borderRadius: 12, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge > 0 && (
                <div style={{ position: "absolute", top: -4, right: -6,
                  minWidth: 16, height: 16, borderRadius: 8, background: "#DC2626", color: "#FFFFFF",
                  fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 4px", border: "2px solid #F5F0E8" }}>{item.badge}</div>
              )}
            </div>
            <span style={{ fontSize: 10.5, fontWeight: isActive ? 700 : 600 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};


// ========== ITEM DETAIL BLOCKS ==========
const OfficialDealerCard = ({ dealer, t, lang, dir }) => {
  const name = lang === "ar" ? dealer.nameAr : dealer.name;
  const loc = lang === "ar" ? dealer.locationAr : dealer.location;
  return (
    <div style={{
      background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E8 100%)",
      border: "1.5px solid #F5E5C8", borderRadius: 16, padding: 14,
      position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80,
        background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)",
        pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, background: "#FEF3C7",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Star size={14} color="#92400E" fill="#F59E0B" strokeWidth={2} />
        </div>
        <div style={{ flex: 1, textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#92400E",
            textTransform: "uppercase", letterSpacing: 0.5 }}>{t.device.officialDealer}</div>
        </div>
        <div style={{ background: "#FEF3C7", color: "#92400E", padding: "3px 8px",
          borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: 0.4 }}>{t.device.officialBadge}</div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1814",
        textAlign: dir === "rtl" ? "right" : "left", marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: "#6B6359", display: "flex", alignItems: "center", gap: 4,
        flexDirection: dir === "rtl" ? "row-reverse" : "row", marginBottom: 10,
        justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
        <MapPin size={11} />
        <span>{loc}</span>
      </div>
      {dealer.hours && (
        <div style={{ fontSize: 11.5, color: "#9A8E7A", marginBottom: 10,
          textAlign: dir === "rtl" ? "right" : "left" }}>{dealer.hours}</div>
      )}
      <a href={`tel:${dealer.phoneRaw}`} className="fm-tap" style={{
        background: "#1E4D3F", color: "#F5F0E8", textDecoration: "none",
        padding: "9px 14px", borderRadius: 10, fontSize: 12.5,
        fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "inherit" }}>
        <Phone size={13} strokeWidth={2.3} />
        <span className="fm-num">{dealer.phone}</span>
      </a>
    </div>
  );
};

const RecommendedGaragesCard = ({ item, t, lang, dir, customGarages, onOpenSelector }) => {
  const type = ITEM_TYPES[item.type];
  if (!type.garageCategory) return null;
  const selected = getSelectedGaragesCombined(item, customGarages);
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
      borderRadius: 14, padding: 14 }}>
      <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 800,
        textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6,
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <Wrench size={12} /> {t.device.recommendedCenters}
        </span>
        {selected.length > 0 && (
          <button onClick={onOpenSelector} className="fm-tap-light" style={{
            background: "transparent", border: "none", color: "#1E4D3F",
            fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            padding: "3px 6px", borderRadius: 6 }}>{t.device.editRecommended}</button>
        )}
      </div>
      {selected.length === 0 ? (
        <button onClick={onOpenSelector} className="fm-tap" style={{
          width: "100%", padding: "14px 12px", background: "#F5F0E8",
          border: "1.5px dashed #D4C7B0", borderRadius: 12, cursor: "pointer",
          fontFamily: "inherit",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1E4D3F" }}>{t.device.addRecommended}</div>
          <div style={{ fontSize: 11, color: "#6B6359" }}>{t.device.noRecommended}</div>
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {selected.map((g) => (
            <div key={g.id} style={{
              background: "#F5F0E8", borderRadius: 10, padding: "10px 12px",
              display: "flex", alignItems: "center", gap: 10,
              flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
              <div style={{ flex: 1, textAlign: dir === "rtl" ? "right" : "left", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2,
                  flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1814",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    flex: 1, textAlign: dir === "rtl" ? "right" : "left" }}>
                    {lang === "ar" ? g.nameAr : g.name}
                  </div>
                  {g.custom && (
                    <span style={{ background: "#DBEAFE", color: "#1E40AF",
                      fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6,
                      textTransform: "uppercase", letterSpacing: 0.3, flexShrink: 0 }}>★</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#6B6359", display: "flex",
                  alignItems: "center", gap: 4,
                  flexDirection: dir === "rtl" ? "row-reverse" : "row",
                  justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
                  <MapPin size={10} />
                  {lang === "ar" ? (g.locationAr || g.location) : g.location}
                </div>
              </div>
              <a href={`tel:${g.phoneRaw}`} className="fm-tap" style={{
                background: "#1E4D3F", color: "#F5F0E8", textDecoration: "none",
                padding: "6px 10px", borderRadius: 8, fontSize: 11.5, fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: 4,
                fontFamily: "inherit", flexShrink: 0 }}>
                <Phone size={11} strokeWidth={2.3} />
                <span className="fm-num">{g.phone}</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OdometerProgressCard = ({ item, t, lang, dir }) => {
  const odo = getOdometerInfo(item);
  if (!odo) return null;
  if (!odo.hasLast) {
    return (
      <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
        borderRadius: 14, padding: 14, textAlign: dir === "rtl" ? "right" : "left" }}>
        <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 800,
          textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8,
          display: "flex", alignItems: "center", gap: 6,
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <Gauge size={12} /> {t.device.odometer}
        </div>
        <div className="fm-serif fm-num" style={{ fontSize: 26, fontWeight: 600, color: "#1A1814" }}>
          {formatNum(odo.estimatedCurrent)} km
        </div>
        {odo.avgKmPerDay > 0 && (
          <div style={{ fontSize: 11, color: "#6B6359", marginTop: 4,
            display: "flex", alignItems: "center", gap: 4,
            flexDirection: dir === "rtl" ? "row-reverse" : "row",
            justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
            <TrendingUp size={10} />
            <span className="fm-num">{t.device.avgPerDay.replace("{n}", odo.avgKmPerDay)}</span>
          </div>
        )}
      </div>
    );
  }
  const statusColor = odo.status === "overdue" ? "#DC2626" : odo.status === "due" ? "#D97706" : "#16A34A";
  const bgColor = odo.status === "overdue" ? "#FEE2E2" : odo.status === "due" ? "#FEF3C7" : "#DCFCE7";
  const fgColor = odo.status === "overdue" ? "#991B1B" : odo.status === "due" ? "#92400E" : "#166534";
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
      borderRadius: 14, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 800,
          textTransform: "uppercase", letterSpacing: 0.5,
          display: "flex", alignItems: "center", gap: 6,
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <Gauge size={12} /> {t.device.odometer}
        </div>
        <div style={{ textAlign: dir === "rtl" ? "left" : "right" }}>
          <div className="fm-num" style={{ fontSize: 14, fontWeight: 700, color: "#1A1814" }}>
            ~{formatNum(odo.estimatedCurrent)} km
          </div>
          <div style={{ fontSize: 10, color: "#9A8E7A" }}>{t.device.kmEstimated}</div>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ height: 10, background: "#F0EAD9", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${odo.pct}%`, background: statusColor,
            borderRadius: 5, transition: "width 700ms cubic-bezier(0.2, 0.9, 0.3, 1)" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8,
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontSize: 11, color: "#6B6359" }}>{t.device.kmSinceService}</div>
          <div className="fm-num" style={{ fontSize: 14, fontWeight: 700, color: "#1A1814" }}>
            {formatNum(Math.max(0, odo.driven))} / {formatNum(odo.interval)} km
          </div>
        </div>
        <div style={{ background: bgColor, color: fgColor, padding: "6px 10px",
          borderRadius: 10, fontSize: 12, fontWeight: 800,
          display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
          <span className="fm-num">
            {odo.toGo < 0
              ? `+${formatNum(Math.abs(odo.toGo))} km ${t.device.kmOver}`
              : `${formatNum(odo.toGo)} ${t.device.kmRemaining}`}
          </span>
        </div>
      </div>
      {odo.avgKmPerDay > 0 && (
        <div style={{ fontSize: 11, color: "#6B6359", display: "flex", alignItems: "center", gap: 5,
          paddingTop: 8, borderTop: "1px solid #F0EAD9",
          flexDirection: dir === "rtl" ? "row-reverse" : "row",
          justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
          <TrendingUp size={11} />
          <span className="fm-num">{t.device.avgPerDay.replace("{n}", odo.avgKmPerDay)}</span>
        </div>
      )}
    </div>
  );
};

const NotificationScheduleCard = ({ item, t, lang, dir }) => {
  const schedule = getNotificationSchedule(item, lang);
  if (schedule.length === 0) return null;
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
      borderRadius: 14, padding: 14 }}>
      <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 800,
        textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8,
        display: "flex", alignItems: "center", gap: 6,
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <BellRing size={12} /> {t.device.reminders}
      </div>
      <div style={{ fontSize: 12, color: "#6B6359", marginBottom: 10,
        textAlign: dir === "rtl" ? "right" : "left" }}>{t.device.remindersSub}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {schedule.map((s, i) => {
          const label = s.daysBefore === 0
            ? t.device.onDueDate
            : s.daysBefore === 1
              ? t.device.dayBefore
              : t.device.daysBefore.replace("{n}", s.daysBefore);
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 0", fontSize: 12.5,
              color: s.passed ? "#9A8E7A" : "#1A1814",
              textDecoration: s.passed ? "line-through" : "none",
              flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%",
                background: s.passed ? "#D4C7B0" : (s.daysBefore <= 7 ? "#DC2626" : s.daysBefore <= 30 ? "#D97706" : "#16A34A"),
                flexShrink: 0 }} />
              <div style={{ flex: 1, fontWeight: 600, textAlign: dir === "rtl" ? "right" : "left" }}>{label}</div>
              <div className="fm-num" style={{ fontSize: 11.5, color: "#6B6359", fontWeight: 500 }}>
                {s.fireDateFormatted}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SummerAlertCard = ({ item, t, lang, dir }) => {
  if (!needsSummerAlert(item)) return null;
  return (
    <div style={{
      background: "linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%)",
      border: "1.5px solid #FBBF24", borderRadius: 14, padding: 14,
      display: "flex", gap: 12, alignItems: "flex-start",
      flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F59E0B",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Sun size={18} color="#FFFFFF" strokeWidth={2.3} />
      </div>
      <div style={{ flex: 1, textAlign: dir === "rtl" ? "right" : "left" }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: "#78350F", marginBottom: 3 }}>
          {t.device.summerAlert}
        </div>
        <div style={{ fontSize: 11.5, color: "#92400E", lineHeight: 1.45 }}>
          {t.device.summerAlertSub}
        </div>
      </div>
    </div>
  );
};


// ========== ITEM DETAIL ==========
const ItemDetail = ({ item, t, lang, dir, customGarages, onBack, onDelete, onOpenGarageSelector, onMarkCompleted }) => {
  const type = ITEM_TYPES[item.type];
  const Icon = type.icon;
  const status = getStatus(item);
  const sMeta = statusMeta[status];
  const [tab, setTab] = useState("overview");
  const totalCost = (item.services || []).reduce((a, s) => a + s.cost, 0);
  const officialDealer = getOfficialDealer(item);
  const intervalText = (item.serviceIntervalKm || item.serviceIntervalMonths)
    ? getIntervalText(item, t) : null;

  const getField = (key) => {
    if (!key) return null;
    if (lang === "ar" && item[key + "Ar"]) return item[key + "Ar"];
    return item[key];
  };
  const overviewFields = type.fields.filter((f) =>
    !["notes", "nextServiceDate", "expiryDate", "serviceIntervalKm", "serviceIntervalMonths", "currentOdometer"].includes(f) && item[f]
  );

  return (
    <div className="fm-screen" style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F5F0E8" }}>
      <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center",
        justifyContent: "space-between", flexShrink: 0,
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <button onClick={onBack} className="fm-tap" style={{
          width: 42, height: 42, borderRadius: 12, background: "#FFFFFF",
          border: "1px solid #E8DFD0", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer" }}>
          {dir === "rtl" ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
        </button>
        <button onClick={onDelete} className="fm-tap" style={{
          width: 42, height: 42, borderRadius: 12, background: "#FFFFFF",
          border: "1px solid #E8DFD0", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", color: "#B91C1C" }}>
          <Trash2 size={17} />
        </button>
      </div>
      <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "8px 20px 30px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
          borderRadius: 22, padding: 18, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: type.bg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={30} color={type.fg} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
              <div style={{ fontSize: 11, color: type.fg, fontWeight: 800,
                textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{t.types[item.type].label}</div>
              <div className="fm-serif" style={{ fontSize: 19, fontWeight: 600, color: "#1A1814", lineHeight: 1.15 }}>
                {getItemName(item, lang)}
              </div>
              <div style={{ fontSize: 12, color: "#6B6359", marginTop: 4,
                display: "flex", alignItems: "center", gap: 5,
                justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
                <User size={11} strokeWidth={2.2} />
                {getItemOwner(item, lang)}
              </div>
            </div>
          </div>
          <div style={{ background: sMeta.bg, color: sMeta.fg, borderRadius: 12,
            padding: "10px 12px", fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <sMeta.icon size={15} strokeWidth={2.3} />
            <span style={{ flex: 1, textAlign: dir === "rtl" ? "right" : "left" }}>
              {t.types[item.type].dateLabel}: <span className="fm-num" style={{ fontWeight: 800 }}>
                {formatDate(getItemDate(item), lang)}
              </span>
            </span>
            <span className="fm-num" style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.85 }}>
              {formatStatusText(item, t)}
            </span>
          </div>
          {intervalText && (
            <div style={{ marginTop: 10, fontSize: 11.5, color: "#6B6359",
              display: "flex", alignItems: "center", gap: 5,
              flexDirection: dir === "rtl" ? "row-reverse" : "row",
              justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
              <Clock size={11} />
              {t.device.serviceInterval}: <span style={{ fontWeight: 700, color: "#1A1814" }} className="fm-num">
                {intervalText}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 4, background: "#EDE5D3",
          padding: 4, borderRadius: 12, marginBottom: 12 }}>
          {[
            { key: "overview", label: t.device.tabOverview },
            ...(type.hasServiceHistory ? [{ key: "history", label: t.device.tabHistory }] : []),
            { key: "notes", label: t.device.tabNotes },
          ].map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)} className="fm-tap" style={{
              flex: 1, padding: "9px 4px", borderRadius: 9, border: "none",
              background: tab === tb.key ? "#FFFFFF" : "transparent",
              color: tab === tb.key ? "#1A1814" : "#6B6359",
              fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              boxShadow: tab === tb.key ? "0 1px 3px rgba(26,24,20,0.1)" : "none" }}>{tb.label}</button>
          ))}
        </div>

        <div className="fm-fade" key={tab}>
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SummerAlertCard item={item} t={t} lang={lang} dir={dir} />
              {type.hasOdometer && <OdometerProgressCard item={item} t={t} lang={lang} dir={dir} />}
              {officialDealer && <OfficialDealerCard dealer={officialDealer} t={t} lang={lang} dir={dir} />}
              {type.garageCategory && (
                <RecommendedGaragesCard item={item} t={t} lang={lang} dir={dir}
                  customGarages={customGarages}
                  onOpenSelector={onOpenGarageSelector} />
              )}
              {overviewFields.length > 0 && (
                <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
                  borderRadius: 14, padding: 14 }}>
                  <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10,
                    textAlign: dir === "rtl" ? "right" : "left" }}>{t.device.docInfo}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {overviewFields.map((fk) => {
                      const val = getField(fk);
                      if (!val) return null;
                      const isDate = FIELD_TYPES[fk] === "date";
                      const isNumber = FIELD_TYPES[fk] === "number";
                      return (
                        <div key={fk} style={{ display: "flex", justifyContent: "space-between", gap: 10,
                          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                          <div style={{ fontSize: 12.5, color: "#6B6359", fontWeight: 600,
                            textAlign: dir === "rtl" ? "right" : "left" }}>{t.fields[fk]}</div>
                          <div style={{ fontSize: 13, color: "#1A1814", fontWeight: 700,
                            textAlign: dir === "rtl" ? "left" : "right",
                            wordBreak: "break-word", maxWidth: "60%",
                          }} className={(isDate || isNumber) ? "fm-num" : ""}>
                            {isDate ? formatDate(val, lang) : isNumber ? formatNum(val) : val}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <NotificationScheduleCard item={item} t={t} lang={lang} dir={dir} />
              {type.hasServiceHistory && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #EEE6D7",
                    borderRadius: 14, padding: 14, textAlign: dir === "rtl" ? "right" : "left" }}>
                    <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 800,
                      textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{t.device.totalSpent}</div>
                    <div className="fm-serif fm-num" style={{ fontSize: 20, fontWeight: 600, color: "#1A1814", lineHeight: 1.1 }}>
                      {formatKWD(totalCost, lang)}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B6359", marginTop: 3 }}>
                      {(item.services || []).length} {t.device.servicesCount}
                    </div>
                  </div>
                  <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #EEE6D7",
                    borderRadius: 14, padding: 14, textAlign: dir === "rtl" ? "right" : "left" }}>
                    <div style={{ fontSize: 10.5, color: "#6B6359", fontWeight: 800,
                      textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4,
                      display: "flex", alignItems: "center", gap: 5,
                      flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                      <ImageIcon size={11} /> {t.device.photos}
                    </div>
                    <div className="fm-serif fm-num" style={{ fontSize: 20, fontWeight: 600, color: "#1A1814", lineHeight: 1.1 }}>
                      {item.photos || 0}
                    </div>
                    <button style={{ fontSize: 11, color: "#1E4D3F", fontWeight: 700, marginTop: 3,
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      fontFamily: "inherit" }}>+ {t.device.addPhoto}</button>
                  </div>
                </div>
              )}
              {!type.hasServiceHistory && (
                <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
                  borderRadius: 14, padding: 14, textAlign: "center" }}>
                  <ImageIcon size={22} color="#6B6359" style={{ opacity: 0.5, marginBottom: 6 }} />
                  <div style={{ fontSize: 13, color: "#6B6359", marginBottom: 10 }}>
                    {item.photos > 0 ? `${item.photos} ${t.device.photos}` : t.device.noPhotos}
                  </div>
                  <button className="fm-tap" style={{
                    background: "#1E4D3F", color: "#F5F0E8", border: "none",
                    padding: "9px 16px", borderRadius: 10, fontSize: 12.5,
                    fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Camera size={14} strokeWidth={2.3} />
                    {t.device.addPhoto}
                  </button>
                </div>
              )}

              {/* Mark as completed CTA */}
              <button onClick={onMarkCompleted} className="fm-tap" style={{
                width: "100%", marginTop: 6,
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#FFFFFF", border: "none", padding: 16, borderRadius: 16,
                fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 10px 22px -6px rgba(22,163,74,0.45)",
                flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                <CheckCircle2 size={20} strokeWidth={2.3} />
                <div style={{ display: "flex", flexDirection: "column",
                  alignItems: dir === "rtl" ? "flex-end" : "flex-start", lineHeight: 1.2 }}>
                  <span>{t.device.markCompleted}</span>
                  <span style={{ fontSize: 10.5, opacity: 0.85, fontWeight: 500, marginTop: 2 }}>
                    {t.device.markCompletedSub}
                  </span>
                </div>
              </button>
            </div>
          )}

          {tab === "history" && type.hasServiceHistory && (
            <div>
              <button className="fm-tap" style={{
                width: "100%", background: "#1E4D3F", color: "#F5F0E8",
                border: "none", padding: 13, borderRadius: 14,
                fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 7, marginBottom: 12, fontFamily: "inherit",
                boxShadow: "0 6px 14px -4px rgba(30,77,63,0.4)" }}>
                <Plus size={16} strokeWidth={2.5} /> {t.device.addService}
              </button>
              {(item.services || []).length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center",
                  background: "#FFFFFF", borderRadius: 14, border: "1px dashed #D4C7B0" }}>
                  <Wrench size={26} color="#6B6359" style={{ opacity: 0.5, marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: "#6B6359" }}>{t.device.noServices}</div>
                </div>
              ) : (
                <div className="fm-stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {item.services.map((s) => (
                    <div key={s.id} style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
                      borderRadius: 14, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "flex-start", marginBottom: 4, gap: 10,
                        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1814", flex: 1,
                          textAlign: dir === "rtl" ? "right" : "left" }}>
                          {lang === "ar" ? s.descAr : s.desc}
                        </div>
                        <div className="fm-serif fm-num" style={{ fontSize: 14, fontWeight: 600, color: "#9A4A1A", whiteSpace: "nowrap" }}>
                          {formatKWD(s.cost, lang)}
                        </div>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#6B6359", display: "flex",
                        alignItems: "center", gap: 10, flexWrap: "wrap",
                        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                        <span className="fm-num" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Calendar size={10} />
                          {formatDate(s.date, lang)}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <MapPin size={10} />
                          {lang === "ar" ? s.centerAr : s.center}
                        </span>
                        {typeof s.odometer === "number" && (
                          <span className="fm-num" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <Gauge size={10} />
                            {formatNum(s.odometer)} km
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "notes" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
              borderRadius: 14, padding: 14 }}>
              {(lang === "ar" ? item.notesAr : item.notes) ? (
                <div style={{ fontSize: 13.5, color: "#1A1814", lineHeight: 1.6,
                  textAlign: dir === "rtl" ? "right" : "left" }}>
                  {lang === "ar" ? item.notesAr : item.notes}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#6B6359", textAlign: "center", padding: "20px 0" }}>—</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ========== ADD ITEM ==========
const inputStyle = {
  width: "100%", background: "#FFFFFF", border: "1px solid #E8DFD0",
  borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#1A1814",
  fontFamily: "inherit", outline: "none",
};

const Field = ({ label, required, children, flex }) => (
  <div style={{ marginBottom: 14, flex }}>
    <div style={{ fontSize: 11.5, fontWeight: 800, color: "#6B6359",
      textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6,
      display: "flex", alignItems: "center", gap: 4 }}>
      {label}
      {required && <span style={{ color: "#DC2626" }}>*</span>}
    </div>
    {children}
  </div>
);

const AddItemScreen = ({ t, lang, dir, existingItem, onCancel, onSave }) => {
  const isEdit = !!existingItem;
  const [selectedType, setSelectedType] = useState(existingItem?.type || null);
  const [formData, setFormData] = useState(() => {
    if (!existingItem) return {};
    // Pre-fill from existing item — copy only the fields used by this type
    const type = ITEM_TYPES[existingItem.type];
    const initial = {};
    type.fields.forEach((f) => {
      if (existingItem[f] !== undefined && existingItem[f] !== null) initial[f] = existingItem[f];
    });
    return initial;
  });
  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
  const personalTypes = Object.keys(ITEM_TYPES).filter((k) => ITEM_TYPES[k].section === "personal");
  const homeTypes = Object.keys(ITEM_TYPES).filter((k) => ITEM_TYPES[k].section === "home");
  const reminderTypes = Object.keys(ITEM_TYPES).filter((k) => ITEM_TYPES[k].section === "reminders");

  const canSave = () => {
    if (!selectedType) return false;
    const type = ITEM_TYPES[selectedType];
    return type.fields.every((f) => !REQUIRED_FIELDS.has(f) || formData[f]);
  };

  const TypeCard = ({ typeKey }) => {
    const type = ITEM_TYPES[typeKey];
    const Icon = type.icon;
    const active = selectedType === typeKey;
    const disabled = isEdit && !active;
    return (
      <button onClick={() => { if (!isEdit) { setSelectedType(typeKey); setFormData({}); } }}
        className={disabled ? "" : "fm-tap"}
        disabled={disabled} style={{
        background: active ? type.bg : "#FFFFFF",
        border: active ? `1.5px solid ${type.fg}` : "1px solid #E8DFD0",
        borderRadius: 14, padding: "14px 10px",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 7, cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1, fontFamily: "inherit",
        minWidth: 92, flexShrink: 0 }}>
        <Icon size={22} color={active ? type.fg : "#6B6359"} strokeWidth={2} />
        <span style={{ fontSize: 11, fontWeight: 700, textAlign: "center",
          color: active ? type.fg : "#6B6359", lineHeight: 1.2 }}>{t.types[typeKey].label}</span>
      </button>
    );
  };

  const renderFields = () => {
    const type = ITEM_TYPES[selectedType];
    const fields = type.fields;
    const rendered = [];
    let i = 0;
    while (i < fields.length) {
      const f = fields[i];
      const next = fields[i + 1];
      const fType = FIELD_TYPES[f];
      const nextType = next ? FIELD_TYPES[next] : null;

      if (f === "serviceIntervalKm" && next === "serviceIntervalMonths") {
        rendered.push(
          <div key={f + next}>
            <div style={{ fontSize: 11, color: "#6B6359", fontStyle: "italic",
              marginBottom: 6, textAlign: dir === "rtl" ? "right" : "left" }}>
              {t.addItem.intervalHelp}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label={t.fields[f]} flex={1}>
                <input type="number" value={formData[f] || ""}
                  onChange={(e) => updateField(f, e.target.value ? parseInt(e.target.value) : "")}
                  placeholder={t.placeholders[f]}
                  style={inputStyle} className="fm-input" />
              </Field>
              <Field label={t.fields[next]} flex={1}>
                <input type="number" value={formData[next] || ""}
                  onChange={(e) => updateField(next, e.target.value ? parseInt(e.target.value) : "")}
                  placeholder={t.placeholders[next]}
                  style={inputStyle} className="fm-input" />
              </Field>
            </div>
          </div>
        );
        i += 2; continue;
      }

      if (fType === "date" && nextType === "date") {
        rendered.push(
          <div key={f + next} style={{ display: "flex", gap: 10 }}>
            <Field label={t.fields[f]} required={REQUIRED_FIELDS.has(f)} flex={1}>
              <input type="date" value={formData[f] || ""}
                onChange={(e) => updateField(f, e.target.value)}
                style={inputStyle} className="fm-input" />
            </Field>
            <Field label={t.fields[next]} required={REQUIRED_FIELDS.has(next)} flex={1}>
              <input type="date" value={formData[next] || ""}
                onChange={(e) => updateField(next, e.target.value)}
                style={inputStyle} className="fm-input" />
            </Field>
          </div>
        );
        i += 2; continue;
      }

      if (fType === "textarea") {
        rendered.push(
          <Field key={f} label={t.fields[f]}>
            <textarea value={formData[f] || ""}
              onChange={(e) => updateField(f, e.target.value)}
              placeholder={t.placeholders[f]} rows={3}
              style={{ ...inputStyle, resize: "none", minHeight: 80, paddingTop: 12 }}
              className="fm-input" dir={dir} />
          </Field>
        );
      } else {
        rendered.push(
          <Field key={f} label={t.fields[f]} required={REQUIRED_FIELDS.has(f)}>
            <input type={fType} value={formData[f] || ""}
              onChange={(e) => updateField(f, fType === "number" && e.target.value ? parseInt(e.target.value) : e.target.value)}
              placeholder={t.placeholders[f] || ""}
              style={inputStyle} className="fm-input" dir={dir} />
          </Field>
        );
      }
      i++;
    }
    return rendered;
  };

  const doSave = () => {
    if (!canSave()) return;
    const data = { type: selectedType, ...formData };

    // Service interval auto-calc (only for new items, not edits)
    if (!isEdit) {
      if (!data.nextServiceDate && data.serviceIntervalMonths && !data.lastService) {
        const today = TODAY.toISOString().slice(0, 10);
        data.nextServiceDate = addMonthsISO(today, data.serviceIntervalMonths);
      } else if (!data.nextServiceDate && data.serviceIntervalMonths && data.lastService) {
        data.nextServiceDate = addMonthsISO(data.lastService, data.serviceIntervalMonths);
      }
    }
    onSave(data, isEdit ? existingItem.id : null);
  };

  return (
    <div className="fm-modal" style={{
      height: "100%", display: "flex", flexDirection: "column", background: "#F5F0E8" }}>
      <div style={{ padding: "16px 16px 10px", display: "flex",
        alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0,
        flexDirection: dir === "rtl" ? "row-reverse" : "row",
        borderBottom: "1px solid #EEE6D7" }}>
        <button onClick={onCancel} className="fm-tap" style={{
          width: 40, height: 40, borderRadius: 12, background: "#FFFFFF",
          border: "1px solid #E8DFD0", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer" }}>
          <X size={18} color="#1A1814" />
        </button>
        <div className="fm-serif" style={{ fontSize: 18, fontWeight: 600, color: "#1A1814",
          fontStyle: lang === "en" ? "italic" : "normal" }}>
          {isEdit ? t.editItem.title : t.addItem.title}
        </div>
        <div style={{ width: 40 }} />
      </div>
      <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "16px 20px 30px" }}>
        {!isEdit && (
          <>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#6B6359",
              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10,
              textAlign: dir === "rtl" ? "right" : "left" }}>{t.addItem.typeLabel}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#9A4A1A",
              letterSpacing: 0.4, marginBottom: 8, marginTop: 4,
              textAlign: dir === "rtl" ? "right" : "left" }}>{t.addItem.sectionPersonal}</div>
            <div className="fm-scroll" style={{ display: "flex", gap: 8, overflowX: "auto",
              paddingBottom: 4, marginBottom: 14,
              flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
              {personalTypes.map((k) => <TypeCard key={k} typeKey={k} />)}
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#1E4D3F",
              letterSpacing: 0.4, marginBottom: 8,
              textAlign: dir === "rtl" ? "right" : "left" }}>{t.addItem.sectionHome}</div>
            <div className="fm-scroll" style={{ display: "flex", gap: 8, overflowX: "auto",
              paddingBottom: 4, marginBottom: 14,
              flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
              {homeTypes.map((k) => <TypeCard key={k} typeKey={k} />)}
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#6B21A8",
              letterSpacing: 0.4, marginBottom: 8,
              textAlign: dir === "rtl" ? "right" : "left" }}>{t.addItem.sectionReminders}</div>
            <div className="fm-scroll" style={{ display: "flex", gap: 8, overflowX: "auto",
              paddingBottom: 4, marginBottom: 20,
              flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
              {reminderTypes.map((k) => <TypeCard key={k} typeKey={k} />)}
            </div>
          </>
        )}
        {isEdit && selectedType && (
          <div style={{
            background: ITEM_TYPES[selectedType].bg,
            border: `1px solid ${ITEM_TYPES[selectedType].fg}20`,
            borderRadius: 12, padding: "10px 14px", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            {React.createElement(ITEM_TYPES[selectedType].icon, {
              size: 20, color: ITEM_TYPES[selectedType].fg, strokeWidth: 2,
            })}
            <div style={{ textAlign: dir === "rtl" ? "right" : "left", flex: 1 }}>
              <div style={{ fontSize: 11, color: ITEM_TYPES[selectedType].fg,
                fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4 }}>
                {t.types[selectedType].label}
              </div>
              <div style={{ fontSize: 12.5, color: "#1A1814", fontWeight: 600, marginTop: 1 }}>
                {getItemName(existingItem, lang)}
              </div>
            </div>
          </div>
        )}

        {selectedType && (
          <div className="fm-fade" key={selectedType}>
            {renderFields()}
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#6B6359",
              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6,
              textAlign: dir === "rtl" ? "right" : "left" }}>{t.device.photos}</div>
            <button className="fm-tap" style={{
              width: "100%", background: "#FFFFFF", border: "1.5px dashed #D4C7B0",
              borderRadius: 14, padding: "24px 14px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              cursor: "pointer", color: "#6B6359", fontFamily: "inherit",
              fontSize: 13, marginBottom: 22 }}>
              <Camera size={24} strokeWidth={1.8} />
              {t.addItem.addPhoto}
            </button>
            <button onClick={doSave} disabled={!canSave()}
              className={canSave() ? "fm-tap" : ""}
              style={{
                width: "100%",
                background: canSave() ? "#1E4D3F" : "#D4C7B0",
                color: "#F5F0E8", border: "none", padding: 15, borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: canSave() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                boxShadow: canSave() ? "0 10px 24px -8px rgba(30,77,63,0.5)" : "none" }}
            >{isEdit ? t.editItem.save : t.addItem.save}</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== ALERTS ==========
const AlertsScreen = ({ t, lang, dir, devices, onOpenDevice }) => {
  const overdue = devices.filter((d) => getStatus(d) === "overdue");
  const upcoming = devices.filter((d) => getStatus(d) === "due");
  return (
    <div className="fm-screen" style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F5F0E8" }}>
      <div style={{ padding: "16px 20px 10px", flexShrink: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
        <div className="fm-serif" style={{ fontSize: 26, fontWeight: 500, color: "#1A1814",
          fontStyle: lang === "en" ? "italic" : "normal", lineHeight: 1.1 }}>{t.alerts.title}</div>
        <div style={{ fontSize: 13, color: "#6B6359", marginTop: 4 }}>{t.alerts.sub}</div>
      </div>
      <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "6px 20px 90px" }}>
        {overdue.length === 0 && upcoming.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px",
            background: "#FFFFFF", borderRadius: 20, border: "1px solid #EEE6D7" }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "#DCFCE7",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px" }}>
              <Check size={30} color="#16A34A" strokeWidth={2.5} />
            </div>
            <div className="fm-serif" style={{ fontSize: 22, fontWeight: 600, color: "#1A1814",
              marginBottom: 6, fontStyle: "italic" }}>{t.alerts.allClear}</div>
            <div style={{ fontSize: 13, color: "#6B6359" }}>{t.alerts.allClearSub}</div>
          </div>
        ) : (
          <>
            {overdue.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
                  flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                  <div className="fm-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626" }} />
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#991B1B",
                    textTransform: "uppercase", letterSpacing: 0.5 }}>{t.alerts.overdueTitle} · {overdue.length}</div>
                </div>
                <div className="fm-stagger" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {overdue.map((d) => (
                    <ItemCard key={d.id} item={d} t={t} lang={lang} dir={dir}
                      onClick={() => onOpenDevice(d.id)} />
                  ))}
                </div>
              </div>
            )}
            {upcoming.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
                  flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706" }} />
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#92400E",
                    textTransform: "uppercase", letterSpacing: 0.5 }}>{t.alerts.upcomingTitle} · {upcoming.length}</div>
                </div>
                <div className="fm-stagger" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {upcoming.map((d) => (
                    <ItemCard key={d.id} item={d} t={t} lang={lang} dir={dir}
                      onClick={() => onOpenDevice(d.id)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ========== SETTINGS ==========
const SectionCard = ({ children }) => (
  <div style={{ background: "#FFFFFF", border: "1px solid #EEE6D7",
    borderRadius: 16, marginBottom: 10, overflow: "hidden" }}>{children}</div>
);

const Row = ({ icon: Icon, title, subtitle, right, danger, onClick, dir }) => (
  <button onClick={onClick} className={onClick ? "fm-tap-light" : ""} style={{
    width: "100%", background: "transparent", border: "none",
    padding: 14, display: "flex", alignItems: "center", gap: 12,
    cursor: onClick ? "pointer" : "default", fontFamily: "inherit",
    textAlign: "inherit",
    flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
    <div style={{ width: 36, height: 36, borderRadius: 10,
      background: danger ? "#FEE2E2" : "#F5F0E8",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={17} color={danger ? "#B91C1C" : "#1E4D3F"} strokeWidth={2} />
    </div>
    <div style={{ flex: 1, minWidth: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: danger ? "#B91C1C" : "#1A1814" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11.5, color: "#6B6359", marginTop: 2 }}>{subtitle}</div>}
    </div>
    {right}
  </button>
);

const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} className="fm-tap" style={{
    width: 44, height: 26, borderRadius: 13,
    background: on ? "#1E4D3F" : "#D4C7B0", padding: 3,
    border: "none", cursor: "pointer",
    display: "flex", alignItems: "center",
    justifyContent: on ? "flex-end" : "flex-start",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}>
    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#FFFFFF",
      boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }} />
  </button>
);

const SettingsScreen = ({ t, lang, dir, onToggleLang, onReset, onLoadSample, devices, onEditItem }) => {
  const [notifOn, setNotifOn] = useState(true);
  const owners = useMemo(() => {
    const arr = [], seen = new Set();
    devices.forEach((d) => {
      if (!seen.has(d.owner)) {
        seen.add(d.owner);
        arr.push(lang === "ar" ? (d.ownerAr || d.owner) : d.owner);
      }
    });
    return arr;
  }, [devices, lang]);

  // Physical items only (excludes appointments / other reminders)
  const physicalItems = useMemo(() =>
    devices.filter((d) => {
      const s = ITEM_TYPES[d.type].section;
      return s === "personal" || s === "home";
    }), [devices]);
  const personalList = physicalItems.filter((d) => ITEM_TYPES[d.type].section === "personal");
  const homeList = physicalItems.filter((d) => ITEM_TYPES[d.type].section === "home");

  const ItemRow = ({ item }) => {
    const type = ITEM_TYPES[item.type];
    const Icon = type.icon;
    const status = getStatus(item);
    const sMeta = statusMeta[status];
    return (
      <button onClick={() => onEditItem(item.id)} className="fm-tap-light" style={{
        width: "100%", background: "transparent", border: "none",
        padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer", fontFamily: "inherit", textAlign: "start",
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: type.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={type.fg} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1814",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {getItemName(item, lang)}
          </div>
          <div style={{ fontSize: 11, color: "#6B6359", marginTop: 1,
            display: "flex", alignItems: "center", gap: 4,
            justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
            <User size={9} strokeWidth={2.2} />
            {getItemOwner(item, lang)}
          </div>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: "50%",
          background: sMeta.fg, flexShrink: 0 }} />
        <ChevronRight size={14} color="#9A8E7A"
          style={{ transform: dir === "rtl" ? "rotate(180deg)" : "none", flexShrink: 0 }} />
      </button>
    );
  };

  return (
    <div className="fm-screen" style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F5F0E8" }}>
      <div style={{ padding: "16px 20px 10px", flexShrink: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
        <div className="fm-serif" style={{ fontSize: 26, fontWeight: 500, color: "#1A1814",
          fontStyle: lang === "en" ? "italic" : "normal", lineHeight: 1.1 }}>{t.settings.title}</div>
      </div>
      <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "6px 20px 90px" }}>

        {/* My items section */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#6B6359",
          textTransform: "uppercase", letterSpacing: 0.5,
          marginBottom: 8, padding: "0 4px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <span>{t.settings.myItems}</span>
          <span className="fm-num" style={{ fontWeight: 500, color: "#9A8E7A" }}>
            {t.settings.itemCount.replace("{n}", physicalItems.length)}
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: "#9A8E7A", marginBottom: 10, padding: "0 4px",
          textAlign: dir === "rtl" ? "right" : "left" }}>
          {t.settings.myItemsSub}
        </div>

        {physicalItems.length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1px dashed #D4C7B0",
            borderRadius: 14, padding: "24px 16px", textAlign: "center",
            color: "#6B6359", fontSize: 13, marginBottom: 16 }}>
            {t.settings.myItemsEmpty}
          </div>
        ) : (
          <>
            {personalList.length > 0 && (
              <>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9A4A1A",
                  letterSpacing: 0.4, marginBottom: 6, padding: "4px 4px",
                  textAlign: dir === "rtl" ? "right" : "left" }}>
                  {t.settings.personalItems}
                </div>
                <SectionCard>
                  {personalList.map((item, i) => (
                    <div key={item.id} style={{ borderTop: i > 0 ? "1px solid #EEE6D7" : "none" }}>
                      <ItemRow item={item} />
                    </div>
                  ))}
                </SectionCard>
              </>
            )}
            {homeList.length > 0 && (
              <>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: "#1E4D3F",
                  letterSpacing: 0.4, marginBottom: 6, padding: "4px 4px",
                  textAlign: dir === "rtl" ? "right" : "left" }}>
                  {t.settings.homeItems}
                </div>
                <SectionCard>
                  {homeList.map((item, i) => (
                    <div key={item.id} style={{ borderTop: i > 0 ? "1px solid #EEE6D7" : "none" }}>
                      <ItemRow item={item} />
                    </div>
                  ))}
                </SectionCard>
              </>
            )}
          </>
        )}

        {/* Preferences header */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#6B6359",
          textTransform: "uppercase", letterSpacing: 0.5,
          marginTop: 18, marginBottom: 8, padding: "0 4px",
          textAlign: dir === "rtl" ? "right" : "left" }}>
          {lang === "ar" ? "التفضيلات" : "Preferences"}
        </div>
        <SectionCard>
          <Row icon={Languages} title={t.settings.language} subtitle={t.settings.languageSub} dir={dir}
            right={
              <div style={{ display: "flex", background: "#EDE5D3", borderRadius: 10, padding: 3 }}>
                <button onClick={() => lang !== "en" && onToggleLang()} className="fm-tap" style={{
                  padding: "6px 12px", borderRadius: 8, border: "none",
                  background: lang === "en" ? "#FFFFFF" : "transparent",
                  fontSize: 12, fontWeight: 700,
                  color: lang === "en" ? "#1A1814" : "#6B6359", cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>EN</button>
                <button onClick={() => lang !== "ar" && onToggleLang()} className="fm-tap" style={{
                  padding: "6px 12px", borderRadius: 8, border: "none",
                  background: lang === "ar" ? "#FFFFFF" : "transparent",
                  fontSize: 12, fontWeight: 700,
                  color: lang === "ar" ? "#1A1814" : "#6B6359", cursor: "pointer",
                  fontFamily: "'Tajawal', system-ui, sans-serif" }}>AR</button>
              </div>
            }
          />
        </SectionCard>
        <SectionCard>
          <Row icon={Bell} title={t.settings.notifications} subtitle={t.settings.notificationsSub} dir={dir}
            right={<Toggle on={notifOn} onClick={() => setNotifOn(!notifOn)} />} />
        </SectionCard>
        <SectionCard>
          <Row icon={User} title={t.settings.familyMembers}
            subtitle={`${owners.length} ${t.settings.familyMembersSub}`} dir={dir}
            right={<ChevronRight size={16} color="#6B6359" style={{ transform: dir === "rtl" ? "rotate(180deg)" : "none" }} />} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6,
            padding: "0 14px 14px", borderTop: "1px solid #EEE6D7", paddingTop: 12,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            {owners.map((o) => (
              <span key={o} style={{ background: "#F5F0E8", padding: "5px 11px",
                borderRadius: 100, fontSize: 12, fontWeight: 600, color: "#1A1814" }}>{o}</span>
            ))}
          </div>
        </SectionCard>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#6B6359",
          textTransform: "uppercase", letterSpacing: 0.5,
          marginTop: 12, marginBottom: 8, padding: "0 4px",
          textAlign: dir === "rtl" ? "right" : "left" }}>{t.settings.data}</div>
        <SectionCard>
          <Row icon={FileText} title={t.settings.exportData} dir={dir}
            right={<ChevronRight size={16} color="#6B6359" style={{ transform: dir === "rtl" ? "rotate(180deg)" : "none" }} />}
            onClick={() => {}} />
          <div style={{ borderTop: "1px solid #EEE6D7" }}>
            <Row icon={Plus} title={t.settings.loadSample} onClick={onLoadSample} dir={dir} />
          </div>
          <div style={{ borderTop: "1px solid #EEE6D7" }}>
            <Row icon={Trash2} title={t.settings.resetData} danger onClick={onReset} dir={dir} />
          </div>
        </SectionCard>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: "#9A8E7A" }}>
          {t.settings.version}
        </div>
      </div>
    </div>
  );
};

// ========== ADD CUSTOM GARAGE SHEET ==========
const AddCustomGarageSheet = ({ t, lang, dir, onSave, onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "", location: "", specialty: "" });
  const canSave = form.name.trim() && form.phone.trim() && form.location.trim();

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const doSave = () => {
    if (!canSave) return;
    // Build phoneRaw from the entered phone (strip non-digits + add +965 if missing)
    const digits = form.phone.replace(/\D/g, "");
    const phoneRaw = digits.startsWith("965") ? `+${digits}` : `+965${digits}`;
    onSave({
      name: form.name.trim(), nameAr: form.name.trim(),
      phone: form.phone.trim(), phoneRaw,
      location: form.location.trim(), locationAr: form.location.trim(),
      specialty: form.specialty.trim(), specialtyAr: form.specialty.trim(),
    });
  };

  return (
    <>
      <div onClick={onClose} className="fm-backdrop" style={{
        position: "absolute", inset: 0, background: "rgba(26,24,20,0.5)",
        backdropFilter: "blur(4px)", zIndex: 30 }} />
      <div className="fm-sheet" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 31,
        background: "#F5F0E8", borderRadius: "22px 22px 0 0",
        maxHeight: "92%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: "#D4C7B0", borderRadius: 2 }} />
        </div>
        <div style={{ padding: "4px 20px 14px", flexShrink: 0,
          textAlign: dir === "rtl" ? "right" : "left",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <div>
            <div className="fm-serif" style={{ fontSize: 20, fontWeight: 600, color: "#1A1814",
              fontStyle: lang === "en" ? "italic" : "normal", marginBottom: 3 }}>{t.customGarage.title}</div>
            <div style={{ fontSize: 12.5, color: "#6B6359" }}>{t.customGarage.subtitle}</div>
          </div>
          <button onClick={onClose} className="fm-tap" style={{
            width: 36, height: 36, borderRadius: 10, background: "#FFFFFF",
            border: "1px solid #E8DFD0", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>
        <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "6px 20px 14px" }}>
          <Field label={t.customGarage.name} required>
            <input type="text" value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t.customGarage.namePh}
              style={inputStyle} className="fm-input" dir={dir} autoFocus />
          </Field>
          <Field label={t.customGarage.phone} required>
            <input type="tel" value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder={t.customGarage.phonePh}
              style={inputStyle} className="fm-input" />
          </Field>
          <Field label={t.customGarage.location} required>
            <input type="text" value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder={t.customGarage.locationPh}
              style={inputStyle} className="fm-input" dir={dir} />
          </Field>
          <Field label={t.customGarage.specialty}>
            <input type="text" value={form.specialty}
              onChange={(e) => update("specialty", e.target.value)}
              placeholder={t.customGarage.specialtyPh}
              style={inputStyle} className="fm-input" dir={dir} />
          </Field>
        </div>
        <div style={{ padding: "10px 16px 22px", flexShrink: 0,
          borderTop: "1px solid #E8DFD0", background: "#F5F0E8" }}>
          <button onClick={doSave} disabled={!canSave}
            className={canSave ? "fm-tap" : ""} style={{
              width: "100%", background: canSave ? "#1E4D3F" : "#D4C7B0",
              color: "#F5F0E8", border: "none", padding: 14, borderRadius: 14,
              fontSize: 15, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              boxShadow: canSave ? "0 10px 20px -8px rgba(30,77,63,0.4)" : "none" }}>
            {t.customGarage.save}
          </button>
        </div>
      </div>
    </>
  );
};

// ========== COMPLETE TASK MODAL ==========
const CompleteTaskModal = ({ t, lang, dir, item, onSave, onClose }) => {
  const type = ITEM_TYPES[item.type];
  const isService = type.hasServiceHistory;
  const todayISO = TODAY.toISOString().slice(0, 10);
  const [form, setForm] = useState({
    date: todayISO,
    description: "",
    cost: "",
    center: "",
    odometer: item.currentOdometer ? String(item.currentOdometer) : "",
    newExpiry: addMonthsISO(todayISO, 60), // default: 5 years for doc renewal
  });
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const canSave = isService ? !!form.date : !!form.newExpiry;

  return (
    <>
      <div onClick={onClose} className="fm-backdrop" style={{
        position: "absolute", inset: 0, background: "rgba(26,24,20,0.55)",
        backdropFilter: "blur(4px)", zIndex: 25 }} />
      <div className="fm-sheet" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 26,
        background: "#F5F0E8", borderRadius: "22px 22px 0 0",
        maxHeight: "92%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: "#D4C7B0", borderRadius: 2 }} />
        </div>
        <div style={{ padding: "4px 20px 14px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10,
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10,
              background: "#DCFCE7", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0 }}>
              <CheckCircle2 size={18} color="#16A34A" strokeWidth={2.3} />
            </div>
            <div className="fm-serif" style={{ fontSize: 18, fontWeight: 600, color: "#1A1814",
              fontStyle: lang === "en" ? "italic" : "normal" }}>
              {isService ? t.complete.titleService : t.complete.titleRenewal}
            </div>
          </div>
          <button onClick={onClose} className="fm-tap" style={{
            width: 36, height: 36, borderRadius: 10, background: "#FFFFFF",
            border: "1px solid #E8DFD0", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>
        <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "6px 20px 14px" }}>
          {isService ? (
            <>
              <Field label={t.complete.date} required>
                <input type="date" value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  style={inputStyle} className="fm-input" />
              </Field>
              <Field label={t.complete.description}>
                <input type="text" value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder={t.complete.descriptionPh}
                  style={inputStyle} className="fm-input" dir={dir} />
              </Field>
              <div style={{ display: "flex", gap: 10 }}>
                <Field label={t.complete.cost} flex={1}>
                  <input type="number" step="0.001" value={form.cost}
                    onChange={(e) => update("cost", e.target.value)}
                    placeholder={t.complete.costPh}
                    style={inputStyle} className="fm-input" />
                </Field>
                {type.hasOdometer && (
                  <Field label={t.complete.odometer} flex={1}>
                    <input type="number" value={form.odometer}
                      onChange={(e) => update("odometer", e.target.value)}
                      placeholder={t.complete.odometerPh}
                      style={inputStyle} className="fm-input" />
                  </Field>
                )}
              </div>
              <Field label={t.complete.center}>
                <input type="text" value={form.center}
                  onChange={(e) => update("center", e.target.value)}
                  placeholder={t.complete.centerPh}
                  style={inputStyle} className="fm-input" dir={dir} />
              </Field>
              <div style={{
                background: "#DCFCE7", border: "1px solid #BBF7D0",
                borderRadius: 10, padding: "10px 12px", fontSize: 11.5,
                color: "#166534", display: "flex", alignItems: "center", gap: 6,
                flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                <Info size={13} />
                <span>{t.complete.nextServiceCalc}</span>
              </div>
            </>
          ) : (
            <Field label={t.complete.newExpiry} required>
              <input type="date" value={form.newExpiry}
                onChange={(e) => update("newExpiry", e.target.value)}
                style={inputStyle} className="fm-input" />
            </Field>
          )}
        </div>
        <div style={{ padding: "10px 16px 22px", flexShrink: 0,
          borderTop: "1px solid #E8DFD0", background: "#F5F0E8" }}>
          <button onClick={() => canSave && onSave(form)} disabled={!canSave}
            className={canSave ? "fm-tap" : ""} style={{
              width: "100%",
              background: canSave ? "linear-gradient(135deg, #16A34A 0%, #15803D 100%)" : "#D4C7B0",
              color: "#FFFFFF", border: "none", padding: 14, borderRadius: 14,
              fontSize: 15, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              boxShadow: canSave ? "0 10px 22px -6px rgba(22,163,74,0.45)" : "none" }}>
            {t.complete.save}
          </button>
        </div>
      </div>
    </>
  );
};

// ========== CALENDAR SCREEN ==========
const CalendarScreen = ({ t, lang, dir, devices, calendarMonth, setCalendarMonth,
  selectedDate, setSelectedDate, onOpenDevice }) => {
  const { year, month } = calendarMonth;
  const grid = useMemo(() => getCalendarGrid(year, month), [year, month]);
  const taskMap = useMemo(() => getMonthTaskDates(devices), [devices]);
  const tasksOnSelected = useMemo(() => getItemsForDate(devices, selectedDate), [devices, selectedDate]);

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    setCalendarMonth({ year: d.getFullYear(), month: d.getMonth() });
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    setCalendarMonth({ year: d.getFullYear(), month: d.getMonth() });
  };
  const goToday = () => {
    setCalendarMonth({ year: TODAY.getFullYear(), month: TODAY.getMonth() });
    setSelectedDate(TODAY.toISOString().slice(0, 10));
  };

  // Dots per day — up to 3 distinct colored dots
  const dotsForDay = (iso) => {
    const items = taskMap[iso] || [];
    if (items.length === 0) return [];
    const statuses = Array.from(new Set(items.map(getStatus)));
    const order = { overdue: 0, due: 1, ok: 2 };
    statuses.sort((a, b) => order[a] - order[b]);
    return statuses.slice(0, 3).map((s) => ({
      color: s === "overdue" ? "#DC2626" : s === "due" ? "#D97706" : "#16A34A",
      count: items.filter((i) => getStatus(i) === s).length,
    }));
  };

  return (
    <div className="fm-screen" style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F5F0E8" }}>
      <div style={{ padding: "16px 20px 10px", flexShrink: 0,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
          <div className="fm-serif" style={{ fontSize: 26, fontWeight: 500, color: "#1A1814",
            fontStyle: lang === "en" ? "italic" : "normal", lineHeight: 1.1 }}>{t.calendar.title}</div>
          <div style={{ fontSize: 13, color: "#6B6359", marginTop: 4 }}>{t.calendar.sub}</div>
        </div>
        <button onClick={goToday} className="fm-tap" style={{
          background: "#FFFFFF", border: "1px solid #E8DFD0",
          borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 700,
          color: "#1E4D3F", cursor: "pointer", fontFamily: "inherit" }}>
          {t.calendar.today}
        </button>
      </div>

      <div className="fm-scroll" style={{ flex: 1, overflow: "auto", padding: "6px 16px 100px" }}>
        {/* Month header */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #EEE6D7", borderRadius: 18,
          padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 12, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <button onClick={prevMonth} className="fm-tap" style={{
              width: 36, height: 36, borderRadius: 10, background: "#F5F0E8",
              border: "none", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer" }}>
              {dir === "rtl" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <div className="fm-serif" style={{ fontSize: 17, fontWeight: 600, color: "#1A1814",
              fontStyle: lang === "en" ? "italic" : "normal" }}>
              {t.calendar.months[month]} {year}
            </div>
            <button onClick={nextMonth} className="fm-tap" style={{
              width: 36, height: 36, borderRadius: 10, background: "#F5F0E8",
              border: "none", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer" }}>
              {dir === "rtl" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            gap: 2, marginBottom: 6 }}>
            {t.calendar.days.map((d, i) => (
              <div key={i} style={{
                textAlign: "center", fontSize: 10.5, fontWeight: 800,
                color: "#9A8E7A", textTransform: "uppercase", letterSpacing: 0.3,
                padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {grid.map((cell, i) => {
              const isSelected = cell.iso === selectedDate;
              const dots = dotsForDay(cell.iso);
              return (
                <button key={i} onClick={() => setSelectedDate(cell.iso)}
                  className="fm-tap" style={{
                    aspectRatio: "1 / 1", background: isSelected ? "#1E4D3F"
                      : cell.isToday ? "#FEF3C7" : "transparent",
                    border: cell.isToday && !isSelected ? "1.5px solid #F59E0B" : "none",
                    borderRadius: 10, padding: 2,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 3, cursor: "pointer",
                    fontFamily: "inherit",
                    opacity: cell.inMonth ? 1 : 0.3 }}>
                  <div className="fm-num" style={{
                    fontSize: 13, fontWeight: cell.isToday || isSelected ? 800 : 600,
                    color: isSelected ? "#F5F0E8" : cell.isToday ? "#92400E" : "#1A1814",
                    lineHeight: 1 }}>
                    {cell.date.getDate()}
                  </div>
                  {dots.length > 0 && (
                    <div style={{ display: "flex", gap: 2 }}>
                      {dots.map((dot, di) => (
                        <div key={di} style={{
                          width: 4, height: 4, borderRadius: "50%",
                          background: isSelected ? "#F5F0E8" : dot.color }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day task list */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: "#6B6359",
            textTransform: "uppercase", letterSpacing: 0.6, padding: "4px 4px 10px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <span>{t.calendar.tasksOnDay}</span>
            <span className="fm-num" style={{ fontWeight: 500 }}>
              {formatDate(selectedDate, lang)}
            </span>
          </div>
          {tasksOnSelected.length === 0 ? (
            <div style={{
              background: "#FFFFFF", border: "1px dashed #D4C7B0",
              borderRadius: 14, padding: "30px 20px", textAlign: "center",
              color: "#6B6359" }}>
              <Calendar size={26} style={{ opacity: 0.4, marginBottom: 8 }} />
              <div style={{ fontSize: 13 }}>{t.calendar.noTasks}</div>
            </div>
          ) : (
            <div className="fm-stagger" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {tasksOnSelected.map((d) => (
                <ItemCard key={d.id} item={d} t={t} lang={lang} dir={dir}
                  onClick={() => onOpenDevice(d.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== ROOT ==========
export default function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("sanad.lang") || "en"; } catch { return "en"; }
  });
  const [screen, setScreen] = useState("welcome");
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [devices, setDevices] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sanad.devices")) || []; } catch { return []; }
  });
  const [customGarages, setCustomGarages] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sanad.customGarages")) || []; } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem("sanad.lang", lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem("sanad.devices", JSON.stringify(devices)); } catch {} }, [devices]);
  useEffect(() => { try { localStorage.setItem("sanad.customGarages", JSON.stringify(customGarages)); } catch {} }, [customGarages]);
  const [filters, setFilters] = useState({ status: [], types: [], owners: [] });
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [garageSheetOpen, setGarageSheetOpen] = useState(false);
  const [addGarageOpen, setAddGarageOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => ({
    year: TODAY.getFullYear(), month: TODAY.getMonth(),
  }));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    TODAY.toISOString().slice(0, 10)
  );

  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = T[lang];
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const alertCount = devices.filter((d) => {
    const s = getStatus(d);
    return s === "overdue" || s === "due";
  }).length;

  const handleNav = (key) => {
    if (key === "home") setScreen("home");
    else if (key === "calendar") setScreen("calendar");
    else if (key === "alerts") setScreen("alerts");
    else if (key === "settings") setScreen("settings");
  };
  const showNav = ["home", "calendar", "alerts", "settings"].includes(screen);

  const updateSelectedGarages = (garageIds) => {
    setDevices(devices.map((d) =>
      d.id === selectedDeviceId ? { ...d, selectedGarageIds: garageIds } : d
    ));
  };

  const addCustomGarage = (garage) => {
    const type = ITEM_TYPES[selectedDevice.type];
    const id = `custom_${Date.now()}`;
    const newGarage = {
      id, category: type.garageCategory, custom: true,
      ...garage,
    };
    setCustomGarages([...customGarages, newGarage]);
    // Also auto-select it for this item
    setDevices(devices.map((d) =>
      d.id === selectedDeviceId
        ? { ...d, selectedGarageIds: [...(d.selectedGarageIds || []), id] }
        : d
    ));
    setAddGarageOpen(false);
  };

  const removeCustomGarage = (id) => {
    setCustomGarages(customGarages.filter((g) => g.id !== id));
    setDevices(devices.map((d) => ({
      ...d,
      selectedGarageIds: (d.selectedGarageIds || []).filter((x) => x !== id),
    })));
  };

  // Mark current device as completed — updates item depending on type
  const handleMarkCompleted = (payload) => {
    const type = ITEM_TYPES[selectedDevice.type];
    const todayISO = TODAY.toISOString().slice(0, 10);

    setDevices(devices.map((d) => {
      if (d.id !== selectedDeviceId) return d;
      const updated = { ...d };

      if (type.hasServiceHistory) {
        // Append a new service entry
        const newServiceId = Math.max(0, ...(d.services || []).map((s) => s.id)) + 1;
        const newService = {
          id: newServiceId,
          date: payload.date || todayISO,
          desc: payload.description || "Service completed",
          descAr: payload.description || "تمت الصيانة",
          cost: payload.cost ? parseFloat(payload.cost) : 0,
          center: payload.center || "—",
          centerAr: payload.center || "—",
        };
        if (type.hasOdometer && payload.odometer) {
          newService.odometer = parseInt(payload.odometer);
          updated.currentOdometer = parseInt(payload.odometer);
          updated.odometerDate = payload.date || todayISO;
        }
        updated.services = [newService, ...(d.services || [])];
        updated.lastService = payload.date || todayISO;

        // Auto-calculate next service date based on interval
        if (d.serviceIntervalMonths) {
          updated.nextServiceDate = addMonthsISO(payload.date || todayISO, d.serviceIntervalMonths);
        } else {
          // Default: push 6 months
          updated.nextServiceDate = addMonthsISO(todayISO, 6);
        }
      } else {
        // Doc renewal — just update the expiry date
        updated.expiryDate = payload.newExpiry;
      }
      return updated;
    }));
    setCompleteModalOpen(false);
  };

  return (
    <div className="fm-root" dir={dir} style={{
      width: "100vw", height: "100vh", maxHeight: "100dvh",
      background: "#F5F0E8", position: "fixed", top: 0, left: 0,
      overflow: "hidden",
      fontFamily: lang === "ar"
        ? "'Tajawal', system-ui, sans-serif"
        : "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <GlobalStyles />

      {screen === "welcome" && (
        <WelcomeScreen t={t} dir={dir} lang={lang}
          onStart={() => setScreen("home")}
          onToggleLang={() => setLang(lang === "en" ? "ar" : "en")} />
      )}
      {screen === "home" && (
        <HomeScreen t={t} lang={lang} dir={dir} devices={devices}
          onOpenDevice={(id) => { setSelectedDeviceId(id); setScreen("device"); }}
          onAdd={() => setScreen("add")}
          filters={filters} setFilters={setFilters}
          search={search} setSearch={setSearch}
          onOpenFilter={() => setFilterOpen(true)} />
      )}
      {screen === "calendar" && (
        <CalendarScreen t={t} lang={lang} dir={dir} devices={devices}
          calendarMonth={calendarMonth} setCalendarMonth={setCalendarMonth}
          selectedDate={selectedCalendarDate} setSelectedDate={setSelectedCalendarDate}
          onOpenDevice={(id) => { setSelectedDeviceId(id); setScreen("device"); }} />
      )}
      {screen === "alerts" && (
        <AlertsScreen t={t} lang={lang} dir={dir} devices={devices}
          onOpenDevice={(id) => { setSelectedDeviceId(id); setScreen("device"); }} />
      )}
      {screen === "settings" && (
        <SettingsScreen t={t} lang={lang} dir={dir}
          onToggleLang={() => setLang(lang === "en" ? "ar" : "en")}
          onReset={() => { setDevices([]); setCustomGarages([]); setLang("en"); try { localStorage.removeItem("sanad.devices"); localStorage.removeItem("sanad.customGarages"); localStorage.removeItem("sanad.lang"); } catch {} }}
          onLoadSample={() => setDevices(buildSample())}
          onEditItem={(id) => { setEditingItemId(id); setScreen("edit"); }}
          devices={devices} />
      )}
      {screen === "device" && selectedDevice && (
        <ItemDetail item={selectedDevice} t={t} lang={lang} dir={dir}
          customGarages={customGarages}
          onBack={() => setScreen("home")}
          onDelete={() => {
            setDevices(devices.filter((d) => d.id !== selectedDeviceId));
            setScreen("home");
          }}
          onOpenGarageSelector={() => setGarageSheetOpen(true)}
          onMarkCompleted={() => setCompleteModalOpen(true)} />
      )}
      {screen === "add" && (
        <AddItemScreen t={t} lang={lang} dir={dir}
          onCancel={() => setScreen("home")}
          onSave={(newItem) => {
            const id = Math.max(0, ...devices.map((d) => d.id)) + 1;
            setDevices([...devices, { id, photos: 0, services: [], selectedGarageIds: [], ...newItem }]);
            setScreen("home");
          }} />
      )}
      {screen === "edit" && editingItemId && (() => {
        const existing = devices.find((d) => d.id === editingItemId);
        if (!existing) { setScreen("settings"); return null; }
        return (
          <AddItemScreen t={t} lang={lang} dir={dir}
            existingItem={existing}
            onCancel={() => { setEditingItemId(null); setScreen("settings"); }}
            onSave={(updated, editedId) => {
              const type = ITEM_TYPES[existing.type];
              // Detect which fields actually changed
              const changedCount = type.fields.filter((f) =>
                (updated[f] ?? "") !== (existing[f] ?? "")
              ).length;
              setDevices(devices.map((d) => {
                if (d.id !== editedId) return d;
                const merged = { ...d, ...updated };
                // Log edit entry for items with service history
                if (type.hasServiceHistory && changedCount > 0) {
                  const todayISO = TODAY.toISOString().slice(0, 10);
                  const newId = Math.max(0, ...(d.services || []).map((s) => s.id)) + 1;
                  const editEntry = {
                    id: newId, date: todayISO,
                    desc: `${t.editItem.editLogEntry} — ${t.editItem.fieldsChanged.replace("{n}", changedCount)}`,
                    descAr: `${t.editItem.editLogEntry} — ${t.editItem.fieldsChanged.replace("{n}", changedCount)}`,
                    cost: 0, center: "—", centerAr: "—",
                    editEntry: true,
                  };
                  merged.services = [editEntry, ...(d.services || [])];
                }
                return merged;
              }));
              setEditingItemId(null);
              setScreen("settings");
            }} />
        );
      })()}

      {showNav && (
        <BottomNav t={t} active={screen} onNav={handleNav} dir={dir} alertCount={alertCount} />
      )}
      {filterOpen && (
        <FilterSheet t={t} lang={lang} dir={dir} devices={devices}
          filters={filters} setFilters={setFilters}
          onClose={() => setFilterOpen(false)} />
      )}
      {garageSheetOpen && selectedDevice && (
        <GarageSelectorSheet t={t} lang={lang} dir={dir} item={selectedDevice}
          customGarages={customGarages}
          onSave={updateSelectedGarages}
          onAddCustom={() => { setGarageSheetOpen(false); setAddGarageOpen(true); }}
          onRemoveCustom={removeCustomGarage}
          onClose={() => setGarageSheetOpen(false)} />
      )}
      {addGarageOpen && selectedDevice && (
        <AddCustomGarageSheet t={t} lang={lang} dir={dir}
          onSave={addCustomGarage}
          onClose={() => { setAddGarageOpen(false); setGarageSheetOpen(true); }} />
      )}
      {completeModalOpen && selectedDevice && (
        <CompleteTaskModal t={t} lang={lang} dir={dir} item={selectedDevice}
          onSave={handleMarkCompleted}
          onClose={() => setCompleteModalOpen(false)} />
      )}
    </div>
  );
}
