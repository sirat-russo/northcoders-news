import { Routes, Route } from "react-router-dom";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import TopicsPage from "./pages/TopicsPage";
import "./styles.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ArticlesPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:article_id" element={<ArticlePage />} />
      <Route path="/topics" element={<TopicsPage />} />
      <Route path="/topics/:topic_slug" element={<TopicsPage />} />
    </Routes>
  );
}
