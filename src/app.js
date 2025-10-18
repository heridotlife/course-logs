// Import Alpine.js and plugins
import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';

// Import course app component
import { courseApp } from './course-app.js';

// Register plugins
Alpine.plugin(collapse);

// Make courseApp available globally for Alpine.js
window.courseApp = courseApp;

// Start Alpine
window.Alpine = Alpine;
Alpine.start();
