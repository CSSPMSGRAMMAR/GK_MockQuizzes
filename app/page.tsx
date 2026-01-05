'use client';

import { useRouter } from 'next/navigation';
import { useExamStore } from '@/stores/examStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  FileText,
  Target,
  TrendingDown,
  GraduationCap,
  Star,
  PlayCircle,
  Users,
  Shield,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { config } = useExamStore();

  const handleGoToQuizLogin = () => {
    router.push('/login?redirect=/exam');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              PMS Punjab • General Knowledge
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Master PMS Punjab GK in 30 Days
              <span className="block text-emerald-600">
                Live Strategy, Recordings & Full-Length Quiz
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-xl">
              Transform your PMS Punjab GK preparation with Mam Nimra Khan&apos;s examiner-oriented
              course. Live classes, complete syllabus coverage, solved past papers and a
              full-length timed quiz — all aligned with the latest PMS pattern.
            </p>
            <div className="flex flex-wrap gap-3 text-xs md:text-sm">
              <div className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-200">
                <Users className="h-4 w-4 text-emerald-600" />
                <span className="text-gray-700">500+ aspirants trained</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-200">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-gray-700">1 Month Intensive Program</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-200">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-gray-700">Examiner-oriented explanations</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleGoToQuizLogin}
                className="bg-emerald-600 hover:bg-emerald-700 text-base px-6 py-5 rounded-xl"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Login to Access PMS GK Quiz
              </Button>
            </div>
          </div>

          {/* Right: Course Card */}
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-emerald-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  PMS Punjab GK
                </Badge>
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="ml-1 text-slate-500">(Student-loved)</span>
                </div>
              </div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                Master PMS GK in 30 Days — with Mam Nimra Khan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Complete PMS Punjab GK coverage: Current Affairs, Pakistan Affairs, Geography,
                Science, Environment, Mathematics, Computer Science and General Knowledge wrap-up
                — taught with clarity and exam-focused strategy.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">1 Month</p>
                    <p className="text-slate-500">Intensive course</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Complete Syllabus</p>
                    <p className="text-slate-500">PMS Punjab GK</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Live + Recorded</p>
                    <p className="text-slate-500">Recordings provided</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Mock Tests</p>
                    <p className="text-slate-500">Past papers & quiz</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                <p className="font-semibold mb-1">Included PMS GK Quiz</p>
                <p>
                  Full-length {config.totalQuestions}-MCQ quiz ({config.totalMarks} marks,{' '}
                  {config.durationMinutes} minutes, -{config.negativeMarking} negative marking) —{' '}
                  <span className="font-semibold">access controlled for enrolled students only.</span>
                </p>
              </div>

              <Button
                onClick={handleGoToQuizLogin}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Login to Access PMS GK Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What you'll get */}
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">What you&apos;ll get</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-500 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">
                Live + Recorded
              </Badge>
              <h3 className="font-semibold text-slate-900">1 Month Intensive Classes</h3>
              <p className="text-sm text-slate-600">
                Daily interactive sessions covering PMS Punjab GK from basics to exam-level
                mastery — with recordings for every lecture.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-2">
              <Badge variant="outline">Exam-Focused</Badge>
              <h3 className="font-semibold text-slate-900">Complete Syllabus & Past Papers</h3>
              <p className="text-sm text-slate-600">
                Topic-wise coverage of Current Affairs, History, Geography, Science, Environment,
                Mathematics and IT with solved PMS past papers.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">
                Real Exam Feel
              </Badge>
              <h3 className="font-semibold text-slate-900">Full-Length PMS GK Quiz</h3>
              <p className="text-sm text-slate-600">
                Attempt a timed, negatively-marked MCQ quiz built on PMS pattern to test your
                preparation under real exam pressure.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}



