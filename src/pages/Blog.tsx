import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  summary: string;
  image: string;
  category: string;
}

export function Blog() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Düzenli Kan Bağışının Sağlığa Faydaları",
      date: "8 Kasım 2023",
      author: "Dr. Ayşe Yılmaz",
      summary: "Düzenli kan bağışı yapmanın sadece alıcıya değil, bağışçıya da birçok faydası bulunmaktadır. Bu yazımızda düzenli kan bağışının sağlığınıza olan etkilerini inceliyoruz.",
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&h=400&q=80",
      category: "Sağlık"
    },
    {
      id: 2,
      title: "Kan Bağışı Yapmanın 10 Önemli Nedeni",
      date: "5 Kasım 2023",
      author: "Mehmet Demir",
      summary: "Kan bağışı hayat kurtarır. İşte size kan bağışı yapmanız için 10 önemli neden ve topluma katkısı.",
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=600&h=400&q=80",
      category: "Bilinçlendirme"
    },
    {
      id: 3,
      title: "Kan Bağışı Öncesi ve Sonrası Dikkat Edilmesi Gerekenler",
      date: "1 Kasım 2023",
      author: "Uzm. Dr. Ali Kaya",
      summary: "Kan bağışı yapmadan önce ve sonra dikkat etmeniz gereken önemli noktaları sizler için derledik.",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&h=400&q=80",
      category: "Rehber"
    },
    // Add more blog posts for pagination
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 4,
      title: `Blog Yazısı ${i + 4}`,
      date: "1 Kasım 2023",
      author: "Yazar Adı",
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: `https://images.unsplash.com/photo-${1579154204601 + i}?auto=format&fit=crop&w=600&h=400&q=80`,
      category: ["Sağlık", "Bilinçlendirme", "Rehber"][i % 3]
    }))
  ];

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const goToDetail = (id: number) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <br></br>
      <br></br>
      <h1 className="text-4xl font-bold text-red-600 text-center mb-8">Bloglar</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post) => (
          <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">{post.category}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {post.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Yazar: {post.author}</span>
                <button 
                  onClick={() => goToDetail(post.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-medium text-sm"
                >
                  Devamını Oku →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Önceki
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === page
                  ? 'bg-red-600 text-white'
                  : 'hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

export default Blog;