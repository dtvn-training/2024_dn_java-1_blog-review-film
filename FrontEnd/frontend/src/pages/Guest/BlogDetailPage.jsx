import { useParams } from "react-router-dom";
import BlogDetail from "../../components/blogDetail/BlogDetail"

function BlogDetailPage() {

    const { blogId } = useParams();
    
    return (  
        <BlogDetail blogId={blogId} guest={true} />
    );
}

export default BlogDetailPage;