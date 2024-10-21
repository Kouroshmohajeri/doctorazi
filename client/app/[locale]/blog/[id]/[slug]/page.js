import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import styles from "./BlogPost.module.css";
import { getBlogPostByPostId } from "@/lib/actions/blogPost/actions";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import jalaali from "jalaali-js";
import { getFullNameById } from "@/lib/actions/users/actions";
import { getTranslatorById } from "@/lib/actions/translator/actions";
import { getAuthorByAuthorId } from "@/lib/actions/authors/actions";
import CommentSection from "@/components/CommentSection/CommentSection";
import UserComments from "@/components/UserComments/UserComments";

export const dynamicParams = true; // Enable dynamic params for this route

export async function generateMetadata({ params }) {
  const { id } = params;
  const post = await getBlogPostByPostId(id);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title,
    description: post.shortDescription,
  };
}

const BlogPostContent = async ({ params }) => {
  const { id } = params;
  const { locale } = params;
  const post = await getBlogPostByPostId(id);
  const author = await getAuthorByAuthorId(post?.author_id);
  const authorData = await getFullNameById(author?.userId);
  let authorFullName;
  if (authorData) {
    authorFullName = authorData.fullName;
  }
  const translatorId = await getTranslatorById(post?.translatorId);
  const translatorData = await getFullNameById(translatorId?.userId);
  let translatorFullname;
  if (translatorData) {
    translatorFullname = translatorData.fullName;
  }

  if (!post) {
    notFound();
  }
  const formattedDate = format(new Date(post.createdAt), "yyyy-MM-dd");
  const jalaliDate = jalaali.toJalaali(new Date(post.createdAt));
  const formattedJalaliDate = `${jalaliDate.jy}-${jalaliDate.jm
    .toString()
    .padStart(2, "0")}-${jalaliDate.jd.toString().padStart(2, "0")}`;

  return (
    <main>
      <Header />
      {!post.isRejected ? (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.banner}>
              {post.imageUrl && (
                <div className={styles.bannerImgWrapper}>
                  <Image
                    className={styles.bannerImg}
                    src={`https://doctorazi.com/blogs/${post.author_id}/${post.post_id}/${post.imageUrl}`}
                    alt={post.altName}
                    fill
                    sizes="50vw"
                  />
                </div>
              )}
            </div>
            <div className={styles.details}>
              <h1>{locale === "en" ? post.title : post.translatedTitle}</h1>
              <p>
                {locale === "en"
                  ? post.shortDescription
                  : post.translatedShortDescription}
              </p>
            </div>
          </div>
          <div className={styles.devider}>
            <h2>Written By: {authorFullName}</h2>
            <h2>Translated By: {translatorFullname}</h2>
            {locale === "fa" ? (
              <h6>{formattedJalaliDate}</h6>
            ) : (
              <h6>{formattedDate}</h6>
            )}
          </div>
          <div className={`${styles.contentContainer} fr-view`}>
            <div
              className={`${styles.content} fr-view`}
              dangerouslySetInnerHTML={{
                __html: locale === "en" ? post.content : post.translatedContent,
              }}
            />
          </div>
          <hr className={styles.hr} />
          <div className={styles.comments}>
            <div className={styles.commentSection}>
              <CommentSection postId={post.post_id} type={2} />
            </div>
            <div className={styles.userComments}>
              <UserComments
                postId={post.post_id}
                expressionId={2}
                locale={locale}
              />
            </div>
          </div>
        </div>
      ) : (
        <h3 className={styles.notFound}>Post not found</h3>
      )}
      <Footer />
    </main>
  );
};

export default BlogPostContent;
