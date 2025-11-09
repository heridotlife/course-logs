/**
 * Course Planning Application - Main Alpine.js Component
 * Extracted from inline script for better caching and performance
 * 
 * @returns {Object} Alpine.js component data and methods
 */
export function courseApp() {
    return {
        language: localStorage.getItem('language') || 'en',
        translations: {},
        settings: {
            totalSemesters: 8,
            semesterMaxCredits: {
                '1': 20, '2': 20, '3': 24, '4': 24, '5': 24, '6': 24, '7': 24, '8': 24,
                'antara-1': 9, 'antara-2': 9, 'antara-3': 9
            },
            targetCredits: 145
        },
        semesterList: [],
        courses: [],
        showAddModal: false,
        showValidationSummary: false,
        showImportExportModal: false,
        showSettingsModal: false,
        lastSaved: null,
        editingCourse: null,
        newCourse: {
            id: '',
            code: '',
            name: '',
            type: 'Wajib',
            credits: 0,
            lecturer: '',
            recommendedSemester: 1,
            assignedSemester: null
        },
        // Performance: Cache for computed properties
        _cachedUnassigned: null,
        _cachedTotal: null,
        _lastCoursesUpdate: 0,
        _lastTotalUpdate: 0,

        // Focus trap for modal accessibility
        focusTrap: {
            lastFocusedElement: null,
            focusableSelectors: 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            // Use WeakMap to store handlers per modal element to prevent memory leaks
            handlers: new WeakMap(),

            activate(modalElement) {
                this.lastFocusedElement = document.activeElement;
                const focusableElements = modalElement.querySelectorAll(this.focusableSelectors);
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }

                // Remove any existing handler for this modal before adding new one
                const existingHandler = this.handlers.get(modalElement);
                if (existingHandler) {
                    modalElement.removeEventListener('keydown', existingHandler);
                }

                // Create and store new handler for this specific modal
                const handler = (e) => this.handleKeyDown(e, modalElement);
                this.handlers.set(modalElement, handler);
                modalElement.addEventListener('keydown', handler);
            },

            deactivate(modalElement) {
                if (modalElement) {
                    const handler = this.handlers.get(modalElement);
                    if (handler) {
                        modalElement.removeEventListener('keydown', handler);
                        this.handlers.delete(modalElement);
                    }
                }
                if (this.lastFocusedElement) {
                    this.lastFocusedElement.focus();
                }
            },

            handleKeyDown(e, modalElement) {
                if (e.key === 'Tab') {
                    const focusableElements = Array.from(modalElement.querySelectorAll(this.focusableSelectors));
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            }
        },

        // Screen reader announcements
        announceStatus(message) {
            const statusElement = document.getElementById('status-announcements');
            if (statusElement) {
                statusElement.textContent = message;
                // Clear after announcement (screen readers will have read it)
                setTimeout(() => {
                    statusElement.textContent = '';
                }, 3000);
            }
        },

        announceError(message) {
            const errorElement = document.getElementById('error-announcements');
            if (errorElement) {
                errorElement.textContent = message;
                setTimeout(() => {
                    errorElement.textContent = '';
                }, 5000);
            }
        },

        async init() {
            await this.loadTranslations();

            // Check localStorage first
            const hasLocalStorage = this.loadFromLocalStorage();

            // Only load defaults if localStorage is empty
            if (!hasLocalStorage) {
                this.announceStatus(this.t('loading_courses'));
                await this.loadData();
                this.announceStatus(this.t('courses_loaded'));
            } else {
                this.announceStatus(this.t('courses_loaded'));
            }

            this.generateSemesterList();

            // Watch for modal changes to manage focus trapping
            this.$watch('showAddModal', (isOpen) => {
                if (isOpen) {
                    this.$nextTick(() => {
                        const modal = document.querySelector('[x-show="showAddModal"] > div');
                        if (modal) {
                            this.focusTrap.activate(modal);
                        }
                    });
                } else {
                    const modal = document.querySelector('[x-show="showAddModal"] > div');
                    this.focusTrap.deactivate(modal);
                }
            });

            this.$watch('showImportExportModal', (isOpen) => {
                if (isOpen) {
                    this.$nextTick(() => {
                        const modal = document.querySelector('[x-show="showImportExportModal"] > div');
                        if (modal) {
                            this.focusTrap.activate(modal);
                        }
                    });
                } else {
                    const modal = document.querySelector('[x-show="showImportExportModal"] > div');
                    this.focusTrap.deactivate(modal);
                }
            });

            this.$watch('showSettingsModal', (isOpen) => {
                if (isOpen) {
                    this.$nextTick(() => {
                        const modal = document.querySelector('[x-show="showSettingsModal"] > div');
                        if (modal) {
                            this.focusTrap.activate(modal);
                        }
                    });
                } else {
                    const modal = document.querySelector('[x-show="showSettingsModal"] > div');
                    this.focusTrap.deactivate(modal);
                }
            });
        },

        generateSemesterList() {
            this.semesterList = [];
            const totalSemesters = this.settings.totalSemesters || 8;
            
            for (let i = 1; i <= totalSemesters; i++) {
                this.semesterList.push({
                    id: String(i),
                    name: `Semester ${i}`,
                    type: 'normal'
                });
                
                // Add antara semester after every 2nd semester, but not after the last semester
                if (i % 2 === 0 && i < totalSemesters) {
                    const antaraNum = i / 2;
                    this.semesterList.push({
                        id: `antara-${antaraNum}`,
                        name: `Antara ${antaraNum}`,
                        type: 'antara'
                    });
                }
            }
            
            // Ensure semesterMaxCredits exists for all semesters
            for (let i = 1; i <= totalSemesters; i++) {
                if (!this.settings.semesterMaxCredits[String(i)]) {
                    // Semester 1 and 2: 20 credits, Semester 3+: 24 credits
                    this.settings.semesterMaxCredits[String(i)] = i <= 2 ? 20 : 24;
                }
            }
            
            // Ensure antara semester credits exist
            const antaraCount = Math.floor((totalSemesters - 1) / 2);
            for (let i = 1; i <= antaraCount; i++) {
                if (!this.settings.semesterMaxCredits[`antara-${i}`]) {
                    this.settings.semesterMaxCredits[`antara-${i}`] = 9;
                }
            }
        },

        t(key) {
            return this.translations[key] || key;
        },

        async loadTranslations() {
            try {
                const response = await fetch(`./locales/${this.language}.json`);

                // ✅ FIX: Handle 503 errors from Cloudflare Pages
                if (!response.ok) {
                    console.warn(`Failed to load ${this.language}.json (${response.status}), using fallback`);
                    this.translations = this.getDefaultTranslations(this.language);
                    document.documentElement.lang = this.language;
                    return;
                }

                this.translations = await response.json();
                document.documentElement.lang = this.language;
            } catch (error) {
                console.error('Error loading translations:', error);
                // ✅ FIX: Fallback to prevent CLS from translation failures
                this.translations = this.getDefaultTranslations(this.language);
                document.documentElement.lang = this.language;
            }
        },

        getDefaultTranslations(language) {
            // ✅ FIX: Inline critical translations to prevent CLS on 503 errors
            // These are the minimum strings needed to render the UI without layout shifts
            const defaults = {
                en: {
                    // Header & Navigation
                    'app_title': 'Course Study Plan',
                    'available_courses': 'Available Courses',
                    'semester_plan': 'Semester Plan',
                    'statistics': 'Statistics',

                    // Actions
                    'add_course': 'Add Course',
                    'auto_map': 'Auto Map',
                    'settings': 'Settings',
                    'import_export': 'Import/Export',
                    'save': 'Save',
                    'cancel': 'Cancel',
                    'edit': 'Edit',
                    'delete': 'Delete',
                    'clear_all': 'Clear All',

                    // Course Fields
                    'course_code': 'Code',
                    'course_name': 'Name',
                    'credits': 'Credits',
                    'type': 'Type',
                    'lecturer': 'Lecturer',
                    'semester': 'Semester',
                    'recommended_semester': 'Recommended Semester',

                    // Stats
                    'total_credits': 'Total Credits',
                    'unassigned_courses': 'Unassigned Courses',
                    'target_credits': 'Target Credits',

                    // Validation
                    'validation_passed': 'Validation Passed',
                    'validation_failed': 'Validation Failed',

                    // Misc
                    'loading': 'Loading...',
                    'no_courses': 'No courses available',
                },
                id: {
                    // Header & Navigation
                    'app_title': 'Rencana Studi',
                    'available_courses': 'Mata Kuliah Tersedia',
                    'semester_plan': 'Rencana Semester',
                    'statistics': 'Statistik',

                    // Actions
                    'add_course': 'Tambah Mata Kuliah',
                    'auto_map': 'Pemetaan Otomatis',
                    'settings': 'Pengaturan',
                    'import_export': 'Impor/Ekspor',
                    'save': 'Simpan',
                    'cancel': 'Batal',
                    'edit': 'Ubah',
                    'delete': 'Hapus',
                    'clear_all': 'Hapus Semua',

                    // Course Fields
                    'course_code': 'Kode',
                    'course_name': 'Nama',
                    'credits': 'SKS',
                    'type': 'Tipe',
                    'lecturer': 'Dosen',
                    'semester': 'Semester',
                    'recommended_semester': 'Semester Direkomendasikan',

                    // Stats
                    'total_credits': 'Total SKS',
                    'unassigned_courses': 'Mata Kuliah Belum Ditugaskan',
                    'target_credits': 'Target SKS',

                    // Validation
                    'validation_passed': 'Validasi Berhasil',
                    'validation_failed': 'Validasi Gagal',

                    // Misc
                    'loading': 'Memuat...',
                    'no_courses': 'Tidak ada mata kuliah',
                },
                ja: {
                    // Header & Navigation
                    'app_title': '履修計画',
                    'available_courses': '利用可能な科目',
                    'semester_plan': 'セメスター計画',
                    'statistics': '統計',

                    // Actions
                    'add_course': '科目追加',
                    'auto_map': '自動割当',
                    'settings': '設定',
                    'import_export': 'インポート/エクスポート',
                    'save': '保存',
                    'cancel': 'キャンセル',
                    'edit': '編集',
                    'delete': '削除',
                    'clear_all': 'すべてクリア',

                    // Course Fields
                    'course_code': 'コード',
                    'course_name': '科目名',
                    'credits': '単位',
                    'type': 'タイプ',
                    'lecturer': '講師',
                    'semester': 'セメスター',
                    'recommended_semester': '推奨セメスター',

                    // Stats
                    'total_credits': '総単位数',
                    'unassigned_courses': '未割当科目',
                    'target_credits': '目標単位数',

                    // Validation
                    'validation_passed': '検証成功',
                    'validation_failed': '検証失敗',

                    // Misc
                    'loading': '読み込み中...',
                    'no_courses': '科目がありません',
                }
            };

            return defaults[language] || defaults.en;
        },

        changeLanguage(lang) {
            this.language = lang;
            localStorage.setItem('language', lang);
            this.loadTranslations();
        },

        async loadData() {
            try {
                const response = await fetch('./data/courses.json');
                const data = await response.json();

                if (data.settings) {
                    this.settings = data.settings;
                    // Ensure totalSemesters exists in settings
                    if (!this.settings.totalSemesters) {
                        this.settings.totalSemesters = 8;
                    }
                }

                this.courses = data.courses || [];
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },

        saveToLocalStorage() {
            try {
                const now = new Date().toISOString();
                const dataToSave = {
                    settings: this.settings,
                    courses: this.courses,
                    lastSaved: now
                };
                localStorage.setItem('lectureStudyPlan', JSON.stringify(dataToSave));
                this.lastSaved = now;
                this.announceStatus(this.t('data_saved'));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                this.announceError(this.t('error_import_failed'));
            }
        },

        loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('lectureStudyPlan');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data.settings) {
                        this.settings = data.settings;
                    }
                    if (data.courses) {
                        this.courses = data.courses;
                    }
                    if (data.lastSaved) {
                        this.lastSaved = data.lastSaved;
                    }
                    // Invalidate cache to reflect loaded course assignments
                    this.invalidateCache();
                    return true; // Data was loaded from localStorage
                }
                return false; // No data in localStorage
            } catch (error) {
                console.error('Error loading from localStorage:', error);
                return false;
            }
        },

        getLastSavedText() {
            if (!this.lastSaved) return 'Never saved';
            const date = new Date(this.lastSaved);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            return date.toLocaleString();
        },

        clearLocalStorage() {
            if (confirm('Are you sure you want to clear all saved data? This will reset to the default lectures from JSON.')) {
                localStorage.removeItem('lectureStudyPlan');
                location.reload();
            }
        },

        exportToJSON() {
            const dataToExport = {
                settings: this.settings,
                courses: this.courses,
                exportDate: new Date().toISOString()
            };

            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `course-plan-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            URL.revokeObjectURL(url);
        },

        exportToCSV() {
            const headers = ['ID', 'Code', 'Name', 'Type', 'Credits', 'Lecturer', 'Recommended Semester', 'Assigned Semester'];
            const rows = this.courses.map(c => [
                c.id,
                c.code,
                c.name,
                c.type,
                c.credits,
                c.lecturer,
                c.recommendedSemester,
                c.assignedSemester || ''
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `course-plan-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();

            URL.revokeObjectURL(url);
        },

        exportToPDF() {
            // Ensure validation summary is shown for print
            this.showValidationSummary = true;
            
            // Small delay to ensure DOM is updated before printing
            setTimeout(() => {
                window.print();
            }, 100);
        },

        importCSV(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.announceStatus(this.t('loading'));

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n');
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

                    const newCourses = [];
                    for (let i = 1; i < lines.length; i++) {
                        if (!lines[i].trim()) continue;

                        const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g).map(v => v.trim().replace(/^"|"$/g, ''));

                        const course = {
                            id: values[0] || Date.now().toString() + i,
                            code: values[1] || '',
                            name: values[2] || '',
                            type: values[3] || 'Wajib',
                            credits: parseInt(values[4]) || 0,
                            lecturer: values[5] || '',
                            recommendedSemester: parseInt(values[6]) || 1,
                            assignedSemester: values[7] || null
                        };
                        newCourses.push(course);
                    }

                    if (confirm(this.t('import_confirm').replace('${newCourses.length}', newCourses.length))) {
                        this.courses = newCourses;
                        this.invalidateCache();
                        this.saveToLocalStorage();
                        this.showImportExportModal = false;
                        this.announceStatus(this.t('import_successful'));
                        alert(this.t('import_successful'));
                    }
                } catch (error) {
                    console.error('Error parsing CSV:', error);
                    this.announceError(this.t('import_error'));
                    alert(this.t('import_error'));
                }
                event.target.value = '';
            };
            reader.readAsText(file);
        },

        importJSON(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.announceStatus(this.t('loading'));

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    // Validate the JSON structure
                    if (!data.courses || !Array.isArray(data.courses)) {
                        throw new Error('Invalid JSON format: missing courses array');
                    }

                    const courseCount = data.courses.length;
                    const confirmMessage = `Import ${courseCount} courses from JSON backup?${data.settings ? '\n\nThis will also import settings including semester configuration and credit limits.' : ''}`;

                    if (confirm(confirmMessage)) {
                        // Import courses
                        this.courses = data.courses;

                        // Import settings if available
                        if (data.settings) {
                            this.settings = {
                                ...this.settings,
                                ...data.settings
                            };
                            // Ensure totalSemesters exists
                            if (!this.settings.totalSemesters) {
                                this.settings.totalSemesters = 8;
                            }
                            // Regenerate semester list based on imported settings
                            this.generateSemesterList();
                        }

                        this.invalidateCache();
                        this.saveToLocalStorage();
                        this.showImportExportModal = false;
                        this.announceStatus(this.t('import_successful'));
                        alert(this.t('import_successful'));
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    this.announceError(this.t('import_error'));
                    alert(`${this.t('import_error')}\n\nError: ${error.message}`);
                }
                event.target.value = '';
            };
            reader.readAsText(file);
        },

        getEmptyCourse() {
            return {
                id: '',
                code: '',
                name: '',
                type: 'Wajib',
                credits: 0,
                lecturer: '',
                recommendedSemester: 1,
                assignedSemester: null
            };
        },

        // Performance: Cached computed property
        get unassignedCourses() {
            if (!this._cachedUnassigned || this._lastCoursesUpdate !== this.courses.length) {
                this._cachedUnassigned = this.courses.filter(c => !c.assignedSemester);
                this._lastCoursesUpdate = this.courses.length;
            }
            return this._cachedUnassigned;
        },

        // Performance: Cached computed property
        get totalCreditsTaken() {
            if (this._cachedTotal === null || this._lastTotalUpdate !== this.courses.length) {
                this._cachedTotal = this.courses
                    .filter(c => c.assignedSemester)
                    .reduce((sum, c) => sum + c.credits, 0);
                this._lastTotalUpdate = this.courses.length;
            }
            return this._cachedTotal;
        },

        get progressPercentage() {
            return Math.round((this.totalCreditsTaken / this.settings.targetCredits) * 100);
        },

        // Performance: Invalidate cache when courses change
        invalidateCache() {
            this._cachedUnassigned = null;
            this._cachedTotal = null;
            this._lastCoursesUpdate = 0;
            this._lastTotalUpdate = 0;
        },

        openAddModal() {
            this.editingCourse = null;
            this.newCourse = this.getEmptyCourse();
            this.showAddModal = true;
        },

        openEditModal(course) {
            this.editingCourse = course;
            this.newCourse = { ...course };
            this.showAddModal = true;
        },

        saveCourse() {
            // Validate required fields
            if (!this.newCourse.code || !this.newCourse.name) {
                this.announceError(this.t('error_required_fields'));
                return;
            }

            // Validate credits range
            if (this.newCourse.credits < 1 || this.newCourse.credits > 8) {
                this.announceError(this.t('error_credits_range'));
                return;
            }

            if (this.editingCourse) {
                // Update existing course
                const index = this.courses.findIndex(c => c.id === this.editingCourse.id);
                if (index !== -1) {
                    this.courses[index] = { ...this.newCourse };
                }
            } else {
                // Add new course
                this.newCourse.id = Date.now().toString();
                this.courses.push({ ...this.newCourse });
            }
            this.invalidateCache();
            this.announceStatus(this.t('course_saved'));
            this.closeModal();
            this.saveToLocalStorage();
        },

        deleteCourse(course) {
            if (confirm(`Delete ${course.code} - ${course.name}?`)) {
                const index = this.courses.findIndex(c => c.id === course.id);
                if (index !== -1) {
                    this.courses.splice(index, 1);
                    this.invalidateCache();
                    this.announceStatus(this.t('course_deleted'));
                    this.saveToLocalStorage();
                }
            }
        },

        closeModal() {
            this.showAddModal = false;
            this.editingCourse = null;
            this.newCourse = this.getEmptyCourse();
        },

        assignCourse(course, semester) {
            if (!semester) return;

            const currentCredits = this.getSemesterCredits(semester);
            const maxCredits = this.getSemesterMaxCredits(semester);
            const newTotal = currentCredits + course.credits;

            if (newTotal > maxCredits) {
                const confirmation = confirm(
                    `${this.t('warning_exceed_limit')}\n\n` +
                    `Semester: ${this.getSemesterName(semester)}\n` +
                    `${this.t('current')}: ${currentCredits} ${this.t('sks')}\n` +
                    `${this.t('adding')}: ${course.credits} ${this.t('sks')}\n` +
                    `${this.t('new_total')}: ${newTotal} ${this.t('sks')}\n` +
                    `${this.t('limit')}: ${maxCredits} ${this.t('sks')}\n` +
                    `${this.t('exceeds_by')}: ${newTotal - maxCredits} ${this.t('sks')}\n\n` +
                    `${this.t('proceed')}?`
                );
                if (!confirmation) return;
            }

            course.assignedSemester = semester;
            this.invalidateCache();
            this.saveToLocalStorage();
        },

        autoMapCourses() {
            this.announceStatus(this.t('auto_mapping_courses'));

            let mappedCount = 0;
            const unassigned = this.courses.filter(c => !c.assignedSemester);

            unassigned.forEach(course => {
                // Skip if no recommended semester
                if (!course.recommendedSemester) return;

                // Map to recommended semester if it exists in semesterList
                const recommendedSemester = String(course.recommendedSemester);
                const semesterExists = this.semesterList.find(s => s.id === recommendedSemester);

                if (semesterExists) {
                    course.assignedSemester = recommendedSemester;
                    mappedCount++;
                }
            });

            if (mappedCount > 0) {
                this.invalidateCache();
                this.saveToLocalStorage();
                const message = `${mappedCount} ${this.t('courses_auto_mapped')}`;
                this.announceStatus(message);
                alert(`✓ ${message}`);
            } else {
                this.announceStatus(this.t('operation_complete'));
            }
        },

        getSemesterName(semesterId) {
            const semester = this.semesterList.find(s => s.id === semesterId);
            return semester ? semester.name : semesterId;
        },

        unassignCourse(course) {
            course.assignedSemester = null;
            this.invalidateCache();
            this.saveToLocalStorage();
        },

        getSemesterCourses(semester) {
            return this.courses.filter(c => c.assignedSemester === semester);
        },

        getSemesterCredits(semester) {
            return this.getSemesterCourses(semester)
                .reduce((sum, c) => sum + c.credits, 0);
        },

        getSemesterMaxCredits(semester) {
            return this.settings.semesterMaxCredits[semester] || 24;
        },

        getCreditClass(semester) {
            const credits = this.getSemesterCredits(semester);
            const max = this.getSemesterMaxCredits(semester);
            if (credits > max) return 'text-red-600 dark:text-red-400';
            if (credits === max) return 'text-green-600 dark:text-green-400';
            return 'text-blue-600 dark:text-blue-400';
        },

        getSemesterBorderClass(semester) {
            const credits = this.getSemesterCredits(semester);
            const max = this.getSemesterMaxCredits(semester);
            if (credits > max) return 'border-red-500 dark:border-red-600';
            if (credits === max) return 'border-green-500 dark:border-green-600';
            return 'border-blue-500 dark:border-blue-600';
        }
    };
}
