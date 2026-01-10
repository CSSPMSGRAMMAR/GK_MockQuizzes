'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { isUserLoggedIn, getCurrentUser, clearUserSession } from '@/lib/auth';
import { BRANDING } from '@/lib/branding';
import {
  BookOpen,
  Clock,
  Target,
  FileText,
  LogOut,
  Play,
  CheckCircle2,
  User,
  Search,
  Filter,
  GraduationCap,
  FolderTree,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number;
  passingPercentage: number;
  available: boolean;
  isPublic?: boolean;
  createdAt: string;
  category?: string;
}

interface SubjectTest {
  id: string;
  subject: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number;
  passingPercentage: number;
  available: boolean;
  category: string;
}

// Subject-specific tests structure (to be populated from Extra Material files)
const SUBJECT_TESTS: SubjectTest[] = [
  {
    id: 'subject-past-paper-2021',
    subject: 'Past Paper',
    title: 'Past Paper 2021',
    description: 'Complete past paper from 2021 covering all subjects',
    totalQuestions: 100,
    totalMarks: 100,
    durationMinutes: 120,
    negativeMarking: 0.25,
    passingPercentage: 50,
    available: true,
    category: 'Past Papers',
  },
  {
    id: 'subject-geography',
    subject: 'Geography',
    title: 'Geography Test',
    description: 'Subject-specific test focusing on Geography topics',
    totalQuestions: 50,
    totalMarks: 50,
    durationMinutes: 60,
    negativeMarking: 0.25,
    passingPercentage: 50,
    available: true,
    category: 'Geography',
  },
  {
    id: 'subject-general-science-computer',
    subject: 'Science & Computer',
    title: 'General Science and Computer Test',
    description: 'Test covering General Science and Computer topics',
    totalQuestions: 50,
    totalMarks: 50,
    durationMinutes: 60,
    negativeMarking: 0.25,
    passingPercentage: 50,
    available: true,
    category: 'Science & Technology',
  },
  {
    id: 'subject-current-affairs',
    subject: 'Current Affairs',
    title: 'Current Affairs Test',
    description: 'Test covering recent current affairs and events',
    totalQuestions: 50,
    totalMarks: 50,
    durationMinutes: 60,
    negativeMarking: 0.25,
    passingPercentage: 50,
    available: true,
    category: 'Current Affairs',
  },
  {
    id: 'subject-pakistan-studies',
    subject: 'Pakistan Studies',
    title: 'Pakistan Studies Test',
    description: 'Test focusing on Pakistan Studies topics',
    totalQuestions: 50,
    totalMarks: 50,
    durationMinutes: 60,
    negativeMarking: 0.25,
    passingPercentage: 50,
    available: true,
    category: 'Pakistan Studies',
  },
  {
    id: 'subject-islamiat',
    subject: 'Islamiat',
    title: 'Islamiat Test',
    description: 'Test covering Islamic Studies and History',
    totalQuestions: 50,
    totalMarks: 50,
    durationMinutes: 60,
    negativeMarking: 0.25,
    passingPercentage: 50,
    available: true,
    category: 'Islamic Studies',
  },
];

const SUBJECT_CATEGORIES = [
  'All Subjects',
  'Past Papers',
  'Pakistan Studies',
  'Islamic Studies',
  'Current Affairs',
  'Geography',
  'Science & Technology',
];

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('mock-papers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Subjects');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  // Ensure component is mounted on client before checking auth
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = () => {
      if (!isUserLoggedIn()) {
        router.push('/login');
        return;
      }

      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        loadQuizzes();
      } else {
        router.push('/login');
      }
    };

    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [router, mounted]);

  useEffect(() => {
    if (user && mounted) {
      loadQuizzes();
    }
  }, [user?.username, mounted]);

  const loadQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const premiumQuizzes = data.filter((q: Quiz & { isPublic?: boolean }) => !q.isPublic && q.available);
        setQuizzes(premiumQuizzes);
      } else {
        console.error('Failed to load quizzes:', response.status);
        setQuizzes([]);
      }
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };

  const handleSelectQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const toggleSubjectExpand = (category: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filter mock papers
  const filteredMockPapers = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filter and group subject tests
  const filteredSubjectTests = SUBJECT_TESTS.filter((test) => {
    const matchesCategory = selectedCategory === 'All Subjects' || test.category === selectedCategory;
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedSubjectTests = filteredSubjectTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, SubjectTest[]>);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background academic-hero">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/" className="flex items-center space-x-3 group shrink-0">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden shadow-elegant transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={BRANDING.logo}
                  alt={BRANDING.name}
                  fill
                  sizes="(max-width: 640px) 40px, 48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-lg sm:text-xl bg-academic-gradient bg-clip-text text-transparent">
                  {BRANDING.name}
                </span>
                <p className="text-xs text-muted-foreground font-accent">{BRANDING.tagline}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="truncate max-w-[120px]">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm" className="text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold bg-academic-gradient bg-clip-text text-transparent">
              Practice Tests
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Choose from paid mock tests or subject-specific tests to improve your preparation
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === 'subject-tests' && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="mock-papers" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Paid Mock Tests</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredMockPapers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="subject-tests" className="flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                <span>Subject-Specific Tests</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredSubjectTests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Paid Mock Tests Tab */}
            <TabsContent value="mock-papers" className="space-y-6">
              {filteredMockPapers.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No mock papers found.</p>
                      {searchQuery && (
                        <p className="text-sm mt-2">Try adjusting your search query.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredMockPapers.map((quiz, index) => (
                    <Card
                      key={quiz.id}
                      className="hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/50 group"
                      onClick={() => handleSelectQuiz(quiz.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2 gap-2 flex-wrap">
                          <Badge variant="outline" className="bg-primary/10 text-xs">
                            Mock Paper
                          </Badge>
                          {quiz.available && (
                            <Badge variant="default" className="bg-green-600 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg sm:text-xl line-clamp-2">{quiz.title}</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                          {quiz.description}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Questions:</span>
                            <span className="font-semibold">{quiz.totalQuestions}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Marks:</span>
                            <span className="font-semibold">{quiz.totalMarks}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-semibold">{quiz.durationMinutes} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Negative:</span>
                            <span className="font-semibold text-red-600">-{quiz.negativeMarking}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 transition-all group-hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectQuiz(quiz.id);
                          }}
                        >
                          <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Start Mock Test
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Subject-Specific Tests Tab */}
            <TabsContent value="subject-tests" className="space-y-6">
              {filteredSubjectTests.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No subject-specific tests found.</p>
                      {(searchQuery || selectedCategory !== 'All Subjects') && (
                        <p className="text-sm mt-2">Try adjusting your filters.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedSubjectTests).map(([category, tests]) => (
                    <Card key={category} className="border-2">
                      <CardHeader>
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                          onClick={() => toggleSubjectExpand(category)}
                        >
                          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                            <FolderTree className="h-5 w-5 text-primary" />
                            {category}
                            <Badge variant="secondary" className="ml-2">
                              {tests.length}
                            </Badge>
                          </CardTitle>
                          {expandedSubjects[category] !== false ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </CardHeader>
                      {expandedSubjects[category] !== false && (
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tests.map((test) => (
                              <Card
                                key={test.id}
                                className="hover:shadow-elegant transition-all duration-300 hover:scale-[1.01] cursor-pointer border hover:border-primary/50 group"
                                onClick={() => handleSelectQuiz(test.id)}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between mb-2 gap-2">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                      {test.category}
                                    </Badge>
                                    {test.available && (
                                      <Badge variant="default" className="bg-green-600 text-xs">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Available
                                      </Badge>
                                    )}
                                  </div>
                                  <CardTitle className="text-base sm:text-lg line-clamp-2">{test.title}</CardTitle>
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {test.description}
                                  </p>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                      <span className="text-muted-foreground">{test.totalQuestions} Q</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                                      <span className="text-muted-foreground">{test.durationMinutes} min</span>
                                    </div>
                                  </div>
                                  <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 transition-all group-hover:shadow-lg text-xs sm:text-sm"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectQuiz(test.id);
                                    }}
                                  >
                                    <Play className="h-3 w-3 mr-2" />
                                    Start Test
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Info Card */}
          <Card className="mt-8 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Paid mock tests are comprehensive practice tests covering all subjects. 
                  Subject-specific tests focus on individual topics to help you strengthen specific areas. 
                  Your progress and results are saved for each attempt.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
