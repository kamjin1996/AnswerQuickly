import {Octokit} from '@octokit/rest';
import path from "path";
import fs from "fs";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || '';

const accountsJsonPath = 'data/json/accounts.json';

export interface Account {
    name: string,
    avatar: string,
    id: string,
    github_page: string,
    github_no: string,
    registered_at: number,
}

async function fetchAccountsAndJsonFile() {
    const {data: accountsJsonFile} = await octokit.repos.getContent({
        owner,
        repo,
        path: accountsJsonPath,
    });

    // @ts-ignore
    const content = Buffer.from(accountsJsonFile.content, 'base64').toString('utf8');
    const accounts = JSON.parse(content);
    return {accounts, accountsJsonFile}
}

export async function remoteQueryAccountByGithubPage(github_page: string): Promise<Account | null> {
    try {
        const {accounts} = await fetchAccountsAndJsonFile()
        return accounts.filter((account: any) => {
            return account.github_page == github_page
        })[0]
    } catch (error) {
        console.error('Error fetching accounts from GitHub:', error);
        throw error;
    }
}

let idAccountMap = new Map<string, Account>();

export const preload = (key: 'id') => {
    void localeQueryAccountsMap(key)
}

export async function localeQueryAccountsMap(key: 'id' | 'github_page'| 'github_no'): Promise<Map<string, Account>> {
    if (idAccountMap.size > 0) {
        return idAccountMap
    } else {
        const accountsFilePath = path.join(process.cwd(), 'data', 'json', 'accounts.json');
        const accountsJson = JSON.parse(fs.readFileSync(accountsFilePath, 'utf8'));

        idAccountMap = accountsJson.reduce((map: Map<string, any>, obj: any) => {
            switch (key) {
                case "github_page":
                    map.set(obj.github_page, obj);
                    break
                case 'github_no':
                    map.set(obj.github_no,obj)
                case "id":
                default:
                    map.set(obj.id, obj);
                    break
            }

            return map;
        }, new Map());
        return idAccountMap as Map<string, Account>
    }
}

export async function localQueryAccountByGithubNo(github_no: string): Promise<Account | null> {
    try {
        const map = await localeQueryAccountsMap('github_no')
        return map.get(github_no) as (Account | null)
    } catch (error) {
        console.error('Error fetching account from local:', error);
        throw error;
    }
}

export async function localQueryAccountByGithubPage(github_page?: string | null): Promise<Account | null> {
    if (!github_page) return null
    try {
        const map = await localeQueryAccountsMap('github_page')
        return map.get(github_page) as (Account | null)
    } catch (error) {
        console.error('Error fetching account from local:', error);
        throw error;
    }
}

export async function remoteAddOrUpdateAccount(account: Account) {
    try {
        // Update accounts.json
        const {accountsJsonFile, accounts} = await fetchAccountsAndJsonFile();

        // Remove duplicate accounts
        const newAccounts = [...accounts].reduce((map, item) => {
            map.set(item.github_page, item);
            return map;
        }, new Map<number, Account>()).values();

        const index = newAccounts.findIndex((obj: any) => obj.id === account.id);
        if (index !== -1) {
            newAccounts[index] = account;
        } else {
            newAccounts.push(account);
        }

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: accountsJsonPath,
            message: 'Sync account',
            content: Buffer.from(JSON.stringify(newAccounts, null, 2)).toString('base64'),
            sha: (accountsJsonFile as any).sha,
        });
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}
