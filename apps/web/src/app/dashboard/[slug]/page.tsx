import { DashboardView } from '@/components/dashboard/dashboard-view'


export default async function DashboardPage({ params }: { params: { slug: string } }) {
    const { slug } = params

    return <DashboardView slug={slug} />
}