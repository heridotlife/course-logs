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

        async init() {
            await this.loadTranslations();
            await this.loadData();
            this.loadFromLocalStorage();
            this.generateSemesterList();
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
                this.translations = await response.json();
                document.documentElement.lang = this.language;
            } catch (error) {
                console.error('Error loading translations:', error);
            }
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
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },

        loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('lectureStudyPlan');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data.settings) {
                        this.settings = data.settings;
                        // Regenerate semester list based on loaded settings
                        this.generateSemesterList();
                    }
                    if (data.courses) {
                        this.courses = data.courses;
                    }
                    if (data.lastSaved) {
                        this.lastSaved = data.lastSaved;
                    }
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
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
                        alert(this.t('import_successful'));
                    }
                } catch (error) {
                    console.error('Error parsing CSV:', error);
                    alert(this.t('import_error'));
                }
                event.target.value = '';
            };
            reader.readAsText(file);
        },

        importJSON(event) {
            const file = event.target.files[0];
            if (!file) return;

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
                        alert(this.t('import_successful'));
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
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
            this.closeModal();
            this.saveToLocalStorage();
        },

        deleteCourse(course) {
            if (confirm(`Delete ${course.code} - ${course.name}?`)) {
                const index = this.courses.findIndex(c => c.id === course.id);
                if (index !== -1) {
                    this.courses.splice(index, 1);
                    this.invalidateCache();
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
                alert(`✓ ${mappedCount} ${this.t('courses_auto_mapped')}`);
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
