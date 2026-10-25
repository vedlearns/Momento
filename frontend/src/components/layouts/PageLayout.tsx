import { Body } from './Body'
import { Footer } from './Footer'
import { Header } from './Header'

// Defines the order of the components to be shown on the page 
export function PageLayout()
{
    return(
        <div>
            <Header/>
            <Body/>
            <Footer/>
        </div>
    )
}