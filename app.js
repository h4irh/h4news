// Sample news data
const newsData = [
  {
    id: 1,
    title: "Tech Giant Unveils Revolutionary Smartphone with Holographic Display",
    excerpt: "The latest flagship device promises to transform how we interact with mobile technology.",
    category: "tech",
    image: "/placeholder.svg?height=100&width=100",
    date: "June 12, 2023",
    author: "David Kim",
  },
  {
    id: 2,
    title: "Global Economy Shows Signs of Recovery After Pandemic Downturn",
    excerpt: "Experts point to positive indicators in manufacturing and consumer spending.",
    category: "business",
    image: "/placeholder.svg?height=100&width=100",
    date: "June 11, 2023",
    author: "Jessica Martinez",
  },
  {
    id: 3,
    title: "Scientists Discover Potential Breakthrough in Renewable Energy Storage",
    excerpt: "New material could solve one of the biggest challenges in widespread adoption of green energy.",
    category: "science",
    image: "/placeholder.svg?height=100&width=100",
    date: "June 10, 2023",
    author: "Robert Chen",
  },
  {
    id: 4,
    title: "Historic Election Results Reshape Political Landscape",
    excerpt: "Voters deliver surprising outcome that could impact regional stability.",
    category: "politics",
    image: "/placeholder.svg?height=100&width=100",
    date: "June 9, 2023",
    author: "Sophia Williams",
  },
  {
    id: 5,
    title: "Major Cultural Festival Returns After Three-Year Hiatus",
    excerpt: "Thousands expected to attend the celebration of arts, music, and heritage.",
    category: "world",
    image: "/placeholder.svg?height=100&width=100",
    date: "June 8, 2023",
    author: "James Rodriguez",
  },
  {
    id: 6,
    title: "New Study Reveals Unexpected Benefits of Coffee Consumption",
    excerpt: "Research suggests moderate intake may have protective effects against certain conditions.",
    category: "science",
    image: "/placeholder.svg?height=100&width=100",
    date: "June 7, 2023",
    author: "Emily Johnson",
  },
]

// DOM Elements
const menuToggle = document.getElementById("menuToggle")
const navMenu = document.getElementById("navMenu")
const newsList = document.getElementById("newsList")
const loadMoreBtn = document.getElementById("loadMoreBtn")
const newsletterForm = document.getElementById("newsletterForm")

// Toggle mobile menu
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("nav") && !e.target.closest(".menu-toggle")) {
    navMenu.classList.remove("active")
  }
})

// Load initial news items
let currentNewsIndex = 0
const newsPerLoad = 3

function loadNews() {
  const newsToLoad = newsData.slice(currentNewsIndex, currentNewsIndex + newsPerLoad)

  newsToLoad.forEach((news) => {
    const newsItem = document.createElement("div")
    newsItem.className = "news-item"
    newsItem.innerHTML = `
      <img src="${news.image}" alt="${news.title}" class="news-item-img">
      <div class="news-item-content">
        <span class="category ${news.category}">${news.category}</span>
        <h3><a href="#">${news.title}</a></h3>
        <p class="news-excerpt">${news.excerpt}</p>
        <div class="news-meta">
          <span class="date">${news.date}</span>
          <span class="author">By ${news.author}</span>
        </div>
      </div>
    `
    newsList.appendChild(newsItem)
  })

  currentNewsIndex += newsPerLoad

  // Hide load more button if all news are loaded
  if (currentNewsIndex >= newsData.length) {
    loadMoreBtn.style.display = "none"
  }
}

// Load more news on button click
loadMoreBtn.addEventListener("click", loadNews)

// Handle newsletter form submission
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]').value

  // Simulate form submission
  alert(`Thank you for subscribing with: ${email}`)
  e.target.reset()
})

// Initialize the page
function init() {
  loadNews()

  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Run initialization when DOM is fully loaded
document.addEventListener("DOMContentLoaded", init)
