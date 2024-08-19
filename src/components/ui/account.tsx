import Image from "next/image";

export function Avatar({
                           src,
                           link,
                           alt = "User Avatar",
                           size = 32
                       }: { src: string, alt?: string, link?: string, size?: number }) {
    if (!src) {
        src = '/def_avatar.png'
    }
    if (link) {
        return (
            <a href={link}>
                <Image className='rounded-full' src={src} height={size} width={size} alt='Avatar' title={alt}></Image>
            </a>
        );
    }
    return <Image className='rounded-full' src={src} height={size} width={size} alt={alt} title={alt}></Image>;
}
