'use client'
import React, {createContext, useContext, useEffect, useState} from 'react';

interface AccountInfo {
    id?: string,
    name?: string,
    avatar?: string,
    github_page?: string,
    github_no?: string,
}

interface AccountContextProps {
    accountInfo: AccountInfo;
    acquired: boolean;
    setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo>>;
}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [accountInfo, setAccountInfo] = useState<AccountInfo>({});
    const [acquired, setAcquired] = useState<boolean>(false);

    useEffect(() => {
        if (!acquired) {
            fetch("/api/auth/account/session-info").then(async (response: any | null) => {
               const data =await response.json()
                if (data && Object.hasOwn(data, "name")) {
                    setAccountInfo(data);
                }
                setAcquired(true);
            }).catch((error) => {
                console.log(error)
            });
        }
    }, [acquired]);

    return (
        <AccountContext.Provider value={{accountInfo, acquired, setAccountInfo}}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = (): AccountContextProps => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};
