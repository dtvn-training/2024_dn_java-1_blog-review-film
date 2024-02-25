import config from "~/configs";

// Public routes
const publicRoutes = [
  { path: config.routes.login, component: Signin },
  { path: config.routes.register, component: Signup },
  {
    path: config.routes.coursedetail,
    component: CourseDetail,
    layout: DefaultLayout,
  },
  { path: config.routes.home, component: Home, layout: DefaultLayout },
  {
    path: config.routes.allCourse,
    component: AllCourse,
    layout: DefaultLayout,
  },
  { path: config.routes.courseCreated, component: CourseCreated, layout: ProfileUser },
  { path: config.routes.completedCourse, component: CompletedCourse, layout: ProfileUser, protected: true },
  { path: config.routes.updateCourseFolder, component: UpdateCourse, layout: ProfileUser },
  { path: config.routes.overview, component: Overview, layout: DefaultLayout },
  { path: config.routes.exam, component: ExamPage, protected: true },
  {
    path: config.routes.examFolder,
    component: ExamFolder,
    layout: DefaultLayout,
  },
  { path: config.routes.examResult, component: ExamResult, protected: true },
  { path: config.routes.notFound, component: NotFound },
  {
    path: config.routes.lesson,
    component: Lesson,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: config.routes.vocabulary,
    component: Vocabulary,
    layout: DefaultLayout,
  },
  {
    path: config.routes.vocabularyFolder,
    component: VocabularyFolder,
    layout: DefaultLayout,
  },
  {
    path: config.routes.articlesFolder,
    component: ArticleFolder,
    layout: DefaultLayout,
  },
  { path: config.routes.article, component: Article, layout: DefaultLayout },
  {
    path: config.routes.grammarsFolder,
    component: GrammarsFolder,
    layout: DefaultLayout,
  },
  { path: config.routes.grammar, component: Grammar, layout: DefaultLayout },
  { path: config.routes.learningPath, component: LearningPath},
  { path: config.routes.podcast, component: Podcast, layout: DefaultLayout },
  {
    path: config.routes.profileUser,
    component: ProfileUser,
    layout: ProfileUser,
  },
  {
    path: config.routes.publicProfile,
    component: PublicProfile,
    layout: ProfileUser,
  },
  {
    path: config.routes.changePassword,
    component: ChangePassword,
    layout: ProfileUser,
  },
  {
    path: config.routes.createCourse,
    component: CreateCourse,
    layout: ProfileUser,
  },
  {
    path: config.routes.createLesson,
    component: CreateLesson,
    layout: ProfileUser,
  },
  {
    path: config.routes.examHistoryFolder,
    component: ExamHistoryFolder,
    layout: ProfileUser,
  },
  {
    path: config.routes.examHistory,
    component: ExamHistory,
    layout: ProfileUser
  },
  {
    path: config.routes.listLesson,
    component: ListLesson,
    layout: ProfileUser
  }
];

// Private routes
const privateRoutes = [
  { path: config.routes.admin, component: Dashboard, layout: Admin },
  {
    path: config.routes.courseManagement,
    component: CourseManagement,
    layout: Admin,
  },
  {
    path: config.routes.lessonManagement,
    component: LessonManagement,
    layout: Admin,
  },
  {
    path: config.routes.userManagement,
    component: UserManagement,
    layout: Admin,
  },
  {
    path: config.routes.grammarManagement,
    component: GrammarManagement,
    layout: Admin,
  },
  {
    path: config.routes.vocabularyFolderManagement,
    component: VocabularyFolderManagement,
    layout: Admin,
  },
  {
    path: config.routes.articlesManagement,
    component: ArticlesManagement,
    layout: Admin,
  },
  {
    path: config.routes.vocabularyManagement,
    component: VocabularyManagement,
    layout: Admin,
  },
  {
    path: config.routes.examManagement,
    component: ExamManagement,
    layout: Admin
  },
  {
    path: config.routes.questionManagement,
    component: QuestionManagement,
    layout: Admin
  },
  {
    path: config.routes.statistics,
    component: Statistics,
    layout: Admin
  },
  { path: config.routes.addCourse, component: AddCourseForm, layout: Admin },
  { path: config.routes.addLesson, component: AddLessonForm, layout: Admin },
  { path: config.routes.addGrammar, component: AddGrammarForm, layout: Admin },
  {
    path: config.routes.addVocabularyFolder,
    component: AddVocabularyFolderForm,
    layout: Admin,
  },
  {
    path: config.routes.addArticles,
    component: AddArticlesForm,
    layout: Admin,
  },
  {
    path: config.routes.addVocabulary,
    component: AddVocabularyForm,
    layout: Admin,
  },
  {
    path: config.routes.addExam,
    component: AddExamForm,
    layout: Admin,
  },
  {
    path: config.routes.addQuestion,
    component: AddQuestionForm,
    layout: Admin,
  },
  {path: config.routes.editCourse, component: EditCourseForm, layout: Admin},
  {path: config.routes.editLesson, component: EditLessonForm, layout: Admin},
  {path: config.routes.editArticle, component: EditArticleForm, layout: Admin},
  {path: config.routes.editGrammar, component: EditGrammarForm, layout: Admin},
  {path: config.routes.editVocabularyFolder, component: EditVocabularyFolderForm, layout: Admin},
  {path: config.routes.editVocabulary, component: EditVocabularyForm, layout: Admin},
  {path: config.routes.editExam, component: EditExamForm, layout: Admin},
];

export { publicRoutes, privateRoutes };