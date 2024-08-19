// components/Footer.js
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">About</h3>
                        <p className="mt-4 text-base text-gray-500">
                            Answer Quickly. Articles, and resources to quickly find what you want.

                            If you have an article or tutorial, you can join us directly, submit resources or articles,
                            and join the open source contribution!
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="text-base text-gray-500 hover:text-gray-900">
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts" className="text-base text-gray-500 hover:text-gray-900">
                                    Articles
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Connect</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <a href="https://answer-quickly.vercel.app/" target="_blank"
                                   className="text-base text-gray-500 hover:text-gray-900">
                                    AnswerQuickly
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/kamjin1996/answer-quickly" target="_blank"
                                   className="text-base text-gray-500 hover:text-gray-900">
                                    GitHub
                                </a>
                            </li>
                            {/*<li>*/}
                            {/*  <a href="https://twitter.com/gefei55" target="_blank" className="text-base text-gray-500 hover:text-gray-900">*/}
                            {/*    Twitter*/}
                            {/*  </a>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} Answer Quickly. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
