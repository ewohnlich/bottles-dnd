import basic from "../data/basic.json";

export default function Basic() {
    return (
        <>
            {basic.map(action => (
                <>
                    <h2>{action.title}</h2>
                    <div className="mb-4 p-2 shadow-lg bg-white rounded" key={action.title.toLowerCase()}>
                        {action.description}
                    </div>
                </>
            ))}
        </>
    )
}
