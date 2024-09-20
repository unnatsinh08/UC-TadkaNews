const CategoryPage = ({ fetchNews, category, page, setPage }) => {
    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
  
    useEffect(() => {
      const fetchCategoryNews = async () => {
        try {
          const res = await fetchNews(category, page); // Fetch news for the selected category and page
          setArticles(res.articles || []);
          setTotalPages(res.totalPages || 1);
        } catch (error) {
          console.error('Error fetching category news:', error);
        }
      };
  
      fetchCategoryNews();
    }, [category, page, fetchNews]);
  
    return (
      <div className="news-container">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))
        ) : (
          <p>No articles found</p>
        )}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    );
  };
  