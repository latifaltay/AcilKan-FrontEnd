import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock blog post data - In real app, fetch based on id
  const post = {
    id: parseInt(id || '1'),
    title: "Düzenli Kan Bağışının Sağlığa Faydaları",
    date: "8 Kasım 2023",
    author: "Dr. Ayşe Yılmaz",
    authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content: `
      Düzenli kan bağışı yapmanın hem bağışçıya hem de alıcıya sayısız faydası bulunmaktadır. Bu yazımızda, düzenli kan bağışının sağlığınıza olan önemli etkilerini detaylı olarak inceleyeceğiz.

      Kalp Sağlığına Etkisi
      Düzenli kan bağışı yapmanın en önemli faydalarından biri, kalp sağlığı üzerindeki olumlu etkisidir. Kan bağışı, kandaki demir seviyesini dengeleyerek kalp hastalığı riskini azaltmaya yardımcı olur.

      Yeni Kan Hücrelerinin Üretimi
      Kan bağışı sonrası vücudunuz yeni kan hücreleri üretmeye başlar. Bu süreç, kemik iliğini uyararak daha sağlıklı kan hücrelerinin üretilmesini sağlar.

      Düzenli Sağlık Kontrolü
      Her kan bağışı öncesinde yapılan sağlık kontrolleri sayesinde, çeşitli hastalıkların erken teşhisi mümkün olabilir. Bu kontroller sırasında tansiyon, hemoglobin değerleri ve bulaşıcı hastalıklar test edilir.

      Kalori Yakımı
      Bir ünite kan bağışı yaklaşık 650 kalori yakmaya eşdeğerdir. Bu da kilo kontrolüne yardımcı olabilir.

      Psikolojik Faydalar
      Kan bağışı yapmanın en önemli psikolojik faydası, bir hayat kurtarmaya vesile olmanın verdiği mutluluk ve huzurdur. Bu davranış, toplumsal dayanışmaya katkıda bulunmanın güzel bir örneğidir.
    `,
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1920&q=80",
    category: "Sağlık",
    readTime: "6 dakika"
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 pt-20">
      <button
        onClick={() => navigate('/blog')}
        className="flex items-center text-red-600 hover:text-red-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Bloga Dön
      </button>

      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <img 
          src={post.image}
          alt={post.title}
          className="w-full h-[400px] object-cover"
        />

        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime} okuma</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <img
              src={post.authorImage}
              alt={post.author}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800 dark:text-white">{post.author}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
            </div>
          </div>

          <div className="prose prose-red dark:prose-invert max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Bu yazıyı paylaş
            </h3>
            <div className="flex space-x-4">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default BlogDetail;