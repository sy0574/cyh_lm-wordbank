
import { format } from "date-fns";
import { StudentStats } from "@/types/match";

export const generateReportHtml = (
  filteredStats: StudentStats[],
  selectedClass: string,
  timeFilter: string
) => {
  return `
    <html>
      <head>
        <title>Performance Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .student-section { margin-bottom: 40px; page-break-after: always; }
          .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }
          .metric { background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: center; }
          .performance-details { margin-top: 20px; }
          .word-result { padding: 8px; margin: 4px 0; border-radius: 4px; }
          .correct { background: #dcfce7; color: #166534; }
          .incorrect { background: #fee2e2; color: #991b1b; }
          .chart-container { width: 100%; height: 300px; margin: 20px 0; }
          h2 { color: #1f2937; margin-top: 30px; }
          .student-header { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <div class="header">
          <h1>Performance Report</h1>
          <p>Class: ${selectedClass || 'All Classes'}</p>
          <p>Time Period: ${timeFilter.replace('-', ' ').toUpperCase()}</p>
          <p>Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</p>
        </div>

        ${filteredStats.map((stat, index) => `
          <div class="student-section">
            <div class="student-header">
              <h2>${stat.name}</h2>
            </div>
            
            <div class="metrics">
              <div class="metric">
                <h3>Accuracy</h3>
                <div>${Math.round((stat.correct / stat.total) * 100)}%</div>
              </div>
              <div class="metric">
                <h3>Correct Answers</h3>
                <div>${stat.correct}/${stat.total}</div>
              </div>
              <div class="metric">
                <h3>Avg Response Time</h3>
                <div>${stat.averageResponseTime}ms</div>
              </div>
            </div>

            <div class="chart-container">
              <canvas id="scoreChart${index}"></canvas>
            </div>
            <div class="chart-container">
              <canvas id="responseTimeChart${index}"></canvas>
            </div>

            <div class="performance-details">
              <h3>Performance Details</h3>
              ${stat.words.map(word => `
                <div class="word-result ${word.correct ? 'correct' : 'incorrect'}">
                  <strong>${word.word}</strong>
                  <span style="float: right">
                    ${word.responseTime}ms | 
                    ${word.pointsEarned} points | 
                    ${word.correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <script>
          ${filteredStats.map((stat, index) => `
            const scoreCtx${index} = document.getElementById('scoreChart${index}');
            new Chart(scoreCtx${index}, {
              type: 'line',
              data: {
                labels: ${JSON.stringify(stat.words.map(w => w.answerNumber))},
                datasets: [{
                  label: 'Score',
                  data: ${JSON.stringify(stat.words.map(w => w.pointsEarned))},
                  borderColor: '#4f46e5',
                  tension: 0.1
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Score Trend'
                  }
                }
              }
            });

            const responseTimeCtx${index} = document.getElementById('responseTimeChart${index}');
            new Chart(responseTimeCtx${index}, {
              type: 'line',
              data: {
                labels: ${JSON.stringify(stat.words.map(w => w.answerNumber))},
                datasets: [{
                  label: 'Response Time',
                  data: ${JSON.stringify(stat.words.map(w => w.responseTime))},
                  borderColor: '#10b981',
                  tension: 0.1
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Response Time Trend'
                  }
                }
              }
            });
          `).join('')}
        </script>
      </body>
    </html>
  `;
};
