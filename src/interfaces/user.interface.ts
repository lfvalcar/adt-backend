export interface userGet {
    uid: string;
    ou: string; 
    givenName: string;
    sn: string;
    cn: string;
    mail: string;
    mobile: string;
    st: string;
    title: string;
    l: string;
    telephoneNumber?: string;
    displayName?: string;
    manager?: string
    description?: string;
}