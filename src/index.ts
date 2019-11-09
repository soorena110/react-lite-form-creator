import './Styles/layout.scss'
import './Styles/boxing.scss'
import './Styles/events.scss'

export * from './Form';
export * from './Container';

if ((module as any))
    (module as any).hot.accept('./index.ts');