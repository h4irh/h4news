document.addEventListener('DOMContentLoaded', function() {
  // Current year for copyright
  document.querySelectorAll('.copyright').forEach(el => {
    el.innerHTML = el.innerHTML.replace('{{ currentYear }}', new Date().getFullYear());
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
        navMenu.classList.remove('active');
      }
    });
  }

  // Newsletter subscription form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      
      // In a real implementation, this would send data to a service
      // For now, we'll just show a success message
      showNotification(`Thank you for subscribing with: ${email}`, 'success');
      e.target.reset();
    });
  }

  // Archive page filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const archiveItems = document.querySelectorAll('.archive-item');
  
  if (filterButtons.length && archiveItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        
        // Show all items if 'all' is selected, otherwise filter
        if (category === 'all') {
          archiveItems.forEach(item => item.style.display = 'flex');
        } else {
          archiveItems.forEach(item => {
            if (item.getAttribute('data-category') === category) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  }

  // Archive search functionality
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  if (searchInput && searchBtn && archiveItems.length) {
    const performSearch = () => {
      const searchTerm = searchInput.value.toLowerCase();
      
      archiveItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const excerpt = item.querySelector('.excerpt').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // Load more functionality for archive
  const loadMoreBtn = document.getElementById('loadMoreArchive');
  
  if (loadMoreBtn && archiveItems.length) {
    const itemsPerLoad = 5;
    let currentlyShown = itemsPerLoad;
    
    // Hide items beyond initial load
    archiveItems.forEach((item, index) => {
      if (index >= itemsPerLoad) {
        item.style.display = 'none';
      }
    });
    
    loadMoreBtn.addEventListener('click', function() {
      // Show next batch of items
      for (let i = currentlyShown; i < currentlyShown + itemsPerLoad; i++) {
        if (archiveItems[i]) {
          archiveItems[i].style.display = 'flex';
          archiveItems[i].classList.add('fadeIn');
        }
      }
      
      currentlyShown += itemsPerLoad;
      
      // Hide button if all items are shown
      if (currentlyShown >= archiveItems.length) {
        loadMoreBtn.style.display = 'none';
      }
    });
  }

  // Lazy loading for images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window && lazyImages.length) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const notificationContainer = document.getElementById('notifications');
    if (!notificationContainer) {
      const container = document.createElement('div');
      container.id = 'notifications';
      document.body.appendChild(container);
    }
    
    document.getElementById('notifications').appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  // Add notification container styles
  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    #notifications {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .notification {
      padding: 15px 20px;
      border-radius: 8px;
      background-color: #333;
      color: white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      max-width: 300px;
    }
    
    .notification.success {
      background-color: #4CAF50;
    }
    
    .notification.error {
      background-color: #F44336;
    }
    
    .notification.info {
      background-color: #2196F3;
    }
    
    .notification.fade-out {
      opacity: 0;
      transform: translateY(10px);
    }
  `;
  document.head.appendChild(notificationStyles);

  // Scroll to top button
  const scrollButton = document.createElement('button');
  scrollButton.className = 'scroll-to-top';
  scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollButton);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  });
  
  scrollButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Scroll to top button styles
  const scrollButtonStyles = document.createElement('style');
  scrollButtonStyles.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .scroll-to-top.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .scroll-to-top:hover {
      background-color: #1565c0;
      transform: translateY(-5px);
    }
  `;
  document.head.appendChild(scrollButtonStyles);

  // Handle dynamic page content
  const contentElements = document.querySelectorAll('.dynamic-content');
  if (contentElements.length) {
    contentElements.forEach(element => {
      const url = element.getAttribute('data-url');
      if (url) {
        fetch(url)
          .then(response => response.text())
          .then(html => {
            element.innerHTML = html;
          })
          .catch(error => {
            console.error('Error loading dynamic content:', error);
          });
      }
    });
  }
});
