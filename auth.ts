import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import {Account, remoteAddOrUpdateAccount, remoteQueryAccountByGithubPage} from "@/service/AccountService";
import {v4 as uuidv4} from 'uuid';

import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID || '',
            clientSecret: process.env.AUTH_GITHUB_SECRET || '',
        })
    ],
    callbacks: {
        async signIn({account, profile}) {
            // console.log("account:", account)
            // console.log("profile", profile)
            /**
             * result:
             *
             * account: {
             *   expires_in: 28800,
             *   token_type: 'bearer',
             *   scope: '',
             *   expires_at: 1723739431,
             *   provider: 'github',
             *   type: 'oauth',
             *   providerAccountId: '42973155'
             * }
             * profile {
             *   login: 'kamjin1996',
             *   id: 42973155,
             *   node_id: 'MDQ6VXNlcjQyOTczMTU1',
             *   avatar_url: 'https://avatars.githubusercontent.com/u/42973155?v=4',
             *   gravatar_id: '',
             *   url: 'https://api.github.com/users/kamjin1996',
             *   html_url: 'https://github.com/kamjin1996',
             *   followers_url: 'https://api.github.com/users/kamjin1996/followers',
             *   following_url: 'https://api.github.com/users/kamjin1996/following{/other_user}',
             *   gists_url: 'https://api.github.com/users/kamjin1996/gists{/gist_id}',
             *   starred_url: 'https://api.github.com/users/kamjin1996/starred{/owner}{/repo}',
             *   subscriptions_url: 'https://api.github.com/users/kamjin1996/subscriptions',
             *   organizations_url: 'https://api.github.com/users/kamjin1996/orgs',
             *   repos_url: 'https://api.github.com/users/kamjin1996/repos',
             *   events_url: 'https://api.github.com/users/kamjin1996/events{/privacy}',
             *   received_events_url: 'https://api.github.com/users/kamjin1996/received_events',
             *   type: 'User',
             *   site_admin: false,
             *   name: 'Kamjin',
             *   company: null,
             *   blog: '',
             *   location: 'Hangzhou, China',
             *   email: 'xxxxxxxx@xxxx.com',
             *   hireable: null,
             *   bio: 'full-stack developer | simplicity and freedom | openness and sincerity',
             *   twitter_username: null,
             *   notification_email: null,
             *   public_repos: 233,
             *   public_gists: 0,
             *   followers: 6,
             *   following: 32,
             *   created_at: '2018-09-04T15:11:51Z',
             *   updated_at: '2024-08-15T02:37:10Z'
             * }
             */

            const html_url = profile?.html_url
            //query or add account
            if (html_url) {
                try {
                    const existAccount = await remoteQueryAccountByGithubPage(html_url as string)
                    if (!existAccount) {
                        console.log("Add Account:", html_url)
                        const accountForm = {
                            id: uuidv4(),
                            name: profile?.login,
                            avatar: profile?.avatar_url,
                            registered_at: new Date().getTime(),
                            github_page: profile?.html_url,
                            github_no: String(profile?.id)
                        } as Account
                        await remoteAddOrUpdateAccount(accountForm)
                    }
                } catch (e) {
                    console.error("callbacks error:", e)
                }
            }
            return true
        },
    }
})
