#!/usr/bin/env node

/**
 * Interactive Launch Tracker
 * Manages the portfolio launch checklist with persistent state
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TRACKER_FILE = path.join(__dirname, '../.kiro/launch-tracker.json');
const CHECKLIST_FILE = path.join(__dirname, '../LAUNCH_CHECKLIST.md');

class LaunchTracker {
  constructor() {
    this.data = this.loadData();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  loadData() {
    try {
      return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
    } catch (error) {
      console.error('Error loading tracker data:', error.message);
      process.exit(1);
    }
  }

  saveData() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(TRACKER_FILE, JSON.stringify(this.data, null, 2));
      this.updateChecklistFile();
    } catch (error) {
      console.error('Error saving tracker data:', error.message);
    }
  }

  updateChecklistFile() {
    const progress = this.getProgress();
    const content = this.generateChecklistContent();
    
    try {
      fs.writeFileSync(CHECKLIST_FILE, content);
    } catch (error) {
      console.error('Error updating checklist file:', error.message);
    }
  }

  generateChecklistContent() {
    const progress = this.getProgress();
    const progressBar = this.generateProgressBar(progress.percentage);
    
    let content = `# 🚀 Portfolio Launch Checklist

A comprehensive checklist to prepare your portfolio for launch. Complete each section before going live.

## Progress Overview
- **Total Tasks**: ${progress.total}
- **Completed**: ${progress.completed}
- **Remaining**: ${progress.remaining}
- **Progress**: ${progress.percentage}%

${progressBar}

---

`;

    // Generate sections
    Object.entries(this.data.tasks).forEach(([sectionKey, section]) => {
      content += `## ${this.getSectionIcon(sectionKey)} ${section.name}\n\n`;
      
      const categories = this.groupTasksByCategory(section.tasks);
      
      Object.entries(categories).forEach(([category, tasks]) => {
        content += `### ${category}\n`;
        tasks.forEach(([taskKey, task]) => {
          const checkbox = task.completed ? '[x]' : '[ ]';
          content += `- ${checkbox} **${task.title}**\n`;
        });
        content += '\n';
      });
      
      content += '---\n\n';
    });

    content += `## 📋 Commands

- \`/show all\` - Show all tasks including completed ones
- \`/reset\` - Reset all tasks to incomplete
- \`/undo last\` - Undo the last completed task
- \`/progress\` - Show current progress statistics
- \`/export\` - Export checklist as markdown

---

*Last updated: ${new Date().toLocaleString()}*
*Total tasks: ${progress.total}*`;

    return content;
  }

  generateProgressBar(percentage) {
    const width = 30;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    return `\`[${'█'.repeat(filled)}${'░'.repeat(empty)}]\` ${percentage}%`;
  }

  getSectionIcon(sectionKey) {
    const icons = {
      content: '📝',
      design: '🎨',
      config: '⚙️',
      technical: '🔧',
      deployment: '🚀'
    };
    return icons[sectionKey] || '📋';
  }

  groupTasksByCategory(tasks) {
    const categories = {};
    Object.entries(tasks).forEach(([key, task]) => {
      if (!categories[task.category]) {
        categories[task.category] = [];
      }
      categories[task.category].push([key, task]);
    });
    return categories;
  }

  getProgress() {
    let total = 0;
    let completed = 0;

    Object.values(this.data.tasks).forEach(section => {
      Object.values(section.tasks).forEach(task => {
        total++;
        if (task.completed) completed++;
      });
    });

    return {
      total,
      completed,
      remaining: total - completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  findTask(query) {
    const results = [];
    
    Object.entries(this.data.tasks).forEach(([sectionKey, section]) => {
      Object.entries(section.tasks).forEach(([taskKey, task]) => {
        if (task.title.toLowerCase().includes(query.toLowerCase()) ||
            taskKey.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            sectionKey,
            taskKey,
            task,
            path: `${section.name} > ${task.category}`
          });
        }
      });
    });
    
    return results;
  }

  toggleTask(sectionKey, taskKey) {
    if (this.data.tasks[sectionKey] && this.data.tasks[sectionKey].tasks[taskKey]) {
      const task = this.data.tasks[sectionKey].tasks[taskKey];
      task.completed = !task.completed;
      
      // Update counters
      this.data.completedTasks = this.getProgress().completed;
      
      this.saveData();
      return task;
    }
    return null;
  }

  showProgress() {
    const progress = this.getProgress();
    console.log('\n📊 Progress Overview');
    console.log('===================');
    console.log(`Total Tasks: ${progress.total}`);
    console.log(`Completed: ${progress.completed}`);
    console.log(`Remaining: ${progress.remaining}`);
    console.log(`Progress: ${progress.percentage}%`);
    console.log(this.generateProgressBar(progress.percentage));
    
    // Show section breakdown
    console.log('\n📋 Section Breakdown:');
    Object.entries(this.data.tasks).forEach(([sectionKey, section]) => {
      const sectionTasks = Object.values(section.tasks);
      const sectionCompleted = sectionTasks.filter(t => t.completed).length;
      const sectionTotal = sectionTasks.length;
      const sectionPercentage = Math.round((sectionCompleted / sectionTotal) * 100);
      
      console.log(`${this.getSectionIcon(sectionKey)} ${section.name}: ${sectionCompleted}/${sectionTotal} (${sectionPercentage}%)`);
    });
  }

  showAllTasks() {
    console.log('\n📋 All Tasks');
    console.log('============');
    
    Object.entries(this.data.tasks).forEach(([sectionKey, section]) => {
      console.log(`\n${this.getSectionIcon(sectionKey)} ${section.name}`);
      console.log('-'.repeat(section.name.length + 3));
      
      const categories = this.groupTasksByCategory(section.tasks);
      
      Object.entries(categories).forEach(([category, tasks]) => {
        console.log(`\n  ${category}:`);
        tasks.forEach(([taskKey, task]) => {
          const status = task.completed ? '✅' : '⬜';
          console.log(`    ${status} ${task.title}`);
        });
      });
    });
  }

  resetAllTasks() {
    Object.values(this.data.tasks).forEach(section => {
      Object.values(section.tasks).forEach(task => {
        task.completed = false;
      });
    });
    
    this.data.completedTasks = 0;
    this.saveData();
    console.log('\n🔄 All tasks have been reset to incomplete.');
  }

  exportChecklist() {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `launch-checklist-${timestamp}.md`;
    const content = this.generateChecklistContent();
    
    try {
      fs.writeFileSync(filename, content);
      console.log(`\n📄 Checklist exported to: ${filename}`);
    } catch (error) {
      console.error('Error exporting checklist:', error.message);
    }
  }

  async start() {
    console.log('🚀 Portfolio Launch Tracker');
    console.log('============================');
    
    this.showProgress();
    
    console.log('\nCommands:');
    console.log('- search <query>  : Search for tasks');
    console.log('- toggle <id>     : Toggle task completion');
    console.log('- progress        : Show progress overview');
    console.log('- show all        : Show all tasks');
    console.log('- reset           : Reset all tasks');
    console.log('- export          : Export checklist');
    console.log('- quit            : Exit tracker');
    
    this.promptUser();
  }

  promptUser() {
    this.rl.question('\n> ', (input) => {
      this.handleCommand(input.trim());
    });
  }

  handleCommand(input) {
    const [command, ...args] = input.split(' ');
    const query = args.join(' ');

    switch (command.toLowerCase()) {
      case 'search':
        if (query) {
          const results = this.findTask(query);
          if (results.length > 0) {
            console.log(`\n🔍 Found ${results.length} task(s):`);
            results.forEach((result, index) => {
              const status = result.task.completed ? '✅' : '⬜';
              console.log(`${index + 1}. ${status} ${result.task.title}`);
              console.log(`   Path: ${result.path}`);
              console.log(`   ID: ${result.sectionKey}.${result.taskKey}`);
            });
          } else {
            console.log('\n❌ No tasks found matching your query.');
          }
        } else {
          console.log('\n❌ Please provide a search query.');
        }
        break;

      case 'toggle':
        if (query) {
          const [sectionKey, taskKey] = query.split('.');
          const task = this.toggleTask(sectionKey, taskKey);
          if (task) {
            const status = task.completed ? 'completed' : 'incomplete';
            console.log(`\n✅ Task marked as ${status}: ${task.title}`);
            this.showProgress();
          } else {
            console.log('\n❌ Task not found. Use format: section.task');
          }
        } else {
          console.log('\n❌ Please provide a task ID (e.g., content.name-branding).');
        }
        break;

      case 'progress':
        this.showProgress();
        break;

      case 'show':
        if (args[0] === 'all') {
          this.showAllTasks();
        } else {
          console.log('\n❌ Use "show all" to display all tasks.');
        }
        break;

      case 'reset':
        this.rl.question('Are you sure you want to reset all tasks? (y/N): ', (answer) => {
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            this.resetAllTasks();
          } else {
            console.log('\n❌ Reset cancelled.');
          }
          this.promptUser();
        });
        return;

      case 'export':
        this.exportChecklist();
        break;

      case 'quit':
      case 'exit':
        console.log('\n👋 Goodbye! Your progress has been saved.');
        this.rl.close();
        return;

      case 'help':
        console.log('\nAvailable commands:');
        console.log('- search <query>  : Search for tasks');
        console.log('- toggle <id>     : Toggle task completion');
        console.log('- progress        : Show progress overview');
        console.log('- show all        : Show all tasks');
        console.log('- reset           : Reset all tasks');
        console.log('- export          : Export checklist');
        console.log('- quit            : Exit tracker');
        break;

      default:
        console.log('\n❌ Unknown command. Type "help" for available commands.');
        break;
    }

    this.promptUser();
  }
}

// Start the tracker
if (require.main === module) {
  const tracker = new LaunchTracker();
  tracker.start();
}

module.exports = LaunchTracker;