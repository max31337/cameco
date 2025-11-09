export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            src="/favicon.ico" 
            alt="Cameco Logo"
            {...props}
            className={props.className || 'h-10 w-auto'}
        />
    );
}
