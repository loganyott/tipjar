import React, {useState} from 'react';
import ReactLoading from 'react-loading';
import {Async} from 'react-async';

import './styles.css';

type Person = {
    place: string;
    person: string;
    venmo: string;
    paypal: string;
    cash: string;
    other: string;
};

const App = () => {

    return <div className="App h-screen bg-gray-100">
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
                <h1 className="text-2xl font-bold leading-tight text-gray-900 tracking-tight">Boise Tip Jar</h1>
            </div>

            <div className="relative bg-white overflow-hidden border-gray-200 border-2">
                <div className="max-w-screen-xl mx-auto ">
                    <div
                        className="relative z-10 py-8 bg-white sm:py-16 md:py-20 lg:max-w-2xl lg:w-full lg:py-28">
                        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                            <div className="sm:text-center lg:text-left">
                                <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                                    Send love to our
                                    <br/>
                                    <span className="text-indigo-600">bartenders</span>
                                </h2>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    COVID-19 has shut down restaurants and bars across the state. Many in the industry
                                    are facing weeks of no income. Show your support and give them a virtual tip!
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdK2toVzbnGoURN6PbEMmexHbHoeMpjpuyGdmrz8QwlEjNWbg/viewform"
                                           className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                                            Add Me!
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <svg
                            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                            fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <polygon points="50,0 100,0 50,100 0,100"/>
                        </svg>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                         src="https://cf-images.us-east-1.prod.boltdns.net/v1/static/5615998029001/02d9b717-c65c-483f-9379-0ae668b160e6/dd0ce4e8-7956-4903-9ca3-3a20498614b1/1280x720/match/image.jpg"
                         alt=""/>
                </div>
            </div>
        </header>
        <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-gray-100">
                <div className="px-4 py-6 sm:px-0">
                    <Async promiseFn={load}>
                        <Async.Fulfilled>{({feed: {entry}}) => <TableController rows={entry} />}</Async.Fulfilled>
                        <Async.Pending><ReactLoading type="bars" color="#5a67d8" className="mx-auto" /></Async.Pending>
                    </Async>
                </div>
            </div>
        </main>
    </div>;
};

const TableController = ({ rows }: { rows: GoogleSheetEntry[] }) => {
    const entries = rows.map(convertEntry);
    const [displayed, setDisplayed] = useState(entries);

    return <>
        <Search onChange={value => {
            const safeValue = value.toLowerCase();
            const matches = entries.filter(({ person, place }) =>
                person.toLowerCase().includes(safeValue) || place.toLowerCase().includes(safeValue))
            setDisplayed(matches);
        }} />
        <Table>{displayed.map((entry, i ) => <Entry key={i} {...entry}/>)}</Table>
    </>;
};

type GoogleSheetEntry = {
    id: { $t: string },
    updated: { $t: string },
    category: [{ scheme: string, term: string }],
    title: { type: 'text', $t: string },
    content: { type: 'text', $t: string },
    link: [{ rel: 'self', type: 'application/atom+xml', href: string }]
    gsx$place: { $t: string },
    gsx$person: { $t: string },
    gsx$venmo: { $t: string },
    gsx$paypal: { $t: string },
    gsx$cash: { $t: string },
    gsx$other: { $t: string },
}

const convertEntry = (row: GoogleSheetEntry): Person => ({
    person: row.gsx$person.$t,
    place: row.gsx$place.$t,
    venmo: row.gsx$venmo.$t,
    paypal: row.gsx$paypal.$t,
    cash: row.gsx$cash.$t,
    other: row.gsx$other.$t,
});

const Search = ({ onChange }: { onChange: (value: string) => void }) => {
    const [value, setValue] = useState('');

    return <div className="flex flex-col container center">
        <div className="pb-8 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div
                className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search..."
                    className="py-4 px-4 outline-none appearance-none w-full"
                    value={value}
                    onChange={event => {
                        setValue(event.currentTarget.value);
                        onChange(event.currentTarget.value);
                    }}
                />
            </div>
        </div>
    </div>;
};

const load = async () =>
    (await fetch('https://spreadsheets.google.com/feeds/list/1hjczLVCaeJWJI_PGq440Lk7wOIG9ZEXC0iT5KkDb07Y/1/public/full?alt=json')).json();

const Table = ({ children }: { children?: JSX.Element[] }) => <div className="flex flex-col container center">
        <div className="overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div
                className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table className="min-w-full">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Venmo
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            PayPal
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Cash
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Other
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {children}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;

const Entry = ({ place, person, venmo, paypal, cash, other }: Person) => <tr>
    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="flex items-center">
            {/* Leaving this here as an example of profile photos */}
            {/*<div class="flex-shrink-0 h-10 w-10">*/}
            {/*    <img class="h-10 w-10 rounded-full"*/}
            {/*         src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
            {/*         alt=""/>*/}
            {/*</div>*/}
            <div className="ml-4">
                <div className="text-sm leading-5 font-medium text-gray-900">{person}</div>
                <div className="text-sm leading-5 text-gray-500">{place}</div>
            </div>
        </div>
    </td>
    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="text-sm leading-5 text-gray-900">{venmo}</div>
    </td>
    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="text-sm leading-5 text-gray-900">
            {paypal.includes('paypal.me') ? <a href={`https://${paypal}`}>{paypal}</a> : paypal}
        </div>
    </td>
    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="text-sm leading-5 text-gray-900">
            <a href={`https://cash.me/${cash}`}>{cash}</a>
        </div>
    </td>
    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="text-sm leading-5 text-gray-900">{other}</div>
    </td>
</tr>;

export default App;
