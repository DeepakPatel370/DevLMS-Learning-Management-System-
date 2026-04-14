document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }


  try {
    const data = await api.get('/user/profile');
    if (data.user) {
      document.getElementById('user-name-display').innerText = data.user.name;
    }
    
    if (data.progress) {
      document.getElementById('topics-count').innerText = data.progress.completedTopics.length;
      document.getElementById('code-count').innerText = data.progress.codeSubmissions.length;
      
      const scores = data.progress.quizScores;
      if (scores.length > 0) {
        const totalPerc = scores.reduce((acc, curr) => acc + (curr.score / curr.total * 100), 0);
        document.getElementById('quiz-avg').innerText = Math.round(totalPerc / scores.length) + '%';

        const progressGrid = document.getElementById('progress-list');
        progressGrid.innerHTML = '';
        data.progress.quizScores.forEach(s => {
        if (!s.quizId || !s.quizId.courseId) return;
        
        const course = s.quizId.courseId;
        const topicId = s.quizId.topicId;
        
        let topicName = 'Unknown Topic';
        if (course.topics && Array.isArray(course.topics)) {
          const topic = course.topics.find(t => 
            t._id && (t._id.toString() === topicId.toString())
          );
          if (topic) topicName = topic.title;
        }

        progressGrid.innerHTML += `
          <tr>
            <td>
              <div class="d-flex align-items-center">
                <div class="bg-light p-2 rounded me-3">
                  <i class="fas fa-check-circle text-success"></i>
                </div>
                <div>
                  <div class="fw-bold">${topicName}</div>
                  <div class="text-muted small">${course.title}</div>
                </div>
              </div>
            </td>
            <td>${new Date(s.takenAt).toLocaleDateString()}</td>
            <td>
              <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-primary" style="width: ${(s.score/s.total)*100}%"></div>
              </div>
              <span class="small text-muted">${Math.round((s.score/s.total)*100)}% Match</span>
            </td>
            <td><span class="badge bg-soft-success text-success">${s.score}/${s.total}</span></td>
          </tr>
        `;
      });
      }
    }
  } catch (error) {
    console.error('Error loading dashboard', error);
  }
});
