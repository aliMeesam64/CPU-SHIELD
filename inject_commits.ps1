# Configuration: March 15 to May 20, 2026
$StartDate = [datetime]"2026-03-15"
$EndDate   = [datetime]"2026-05-20"

$TotalCommits = 0
$MaxCommits   = 40

$CommitTypes = @(
    "feat: Add user authentication module",
    "fix: Resolve pagination bug in dashboard",
    "docs: Update API documentation",
    "style: Format code according to standards",
    "refactor: Optimize database queries",
    "test: Add unit tests for payment gateway",
    "chore: Update dependencies",
    "feat: Implement search functionality",
    "fix: Correct date parsing issue",
    "perf: Improve loading time for reports"
)

$ContextSuffixes = @(
    "",
    " (#$(Get-Random -Minimum 100 -Maximum 999))",
    " (fixes bug in production)",
    " (code review feedback)"
)

$CurrentDate = $StartDate

while ($CurrentDate -le $EndDate) {
    $DayOfWeek = $CurrentDate.DayOfWeek   # Sunday=0, Saturday=6

    # Weekend: 30% chance of 1 commit
    if ($DayOfWeek -eq [DayOfWeek]::Saturday -or $DayOfWeek -eq [DayOfWeek]::Sunday) {
        $Rand = Get-Random -Minimum 0 -Maximum 100
        $NumCommits = if ($Rand -lt 30) { 1 } else { 0 }
    }
    else {
        # Weekday: 20% none, 40% one, 25% two, 15% three
        $Rand = Get-Random -Minimum 0 -Maximum 100
        $NumCommits = switch ($true) {
            ($Rand -lt 20) { 0 }
            ($Rand -lt 60) { 1 }
            ($Rand -lt 85) { 2 }
            default        { 3 }
        }
    }

    # Cap at MaxCommits
    if (($TotalCommits + $NumCommits) -gt $MaxCommits) {
        $NumCommits = $MaxCommits - $TotalCommits
        if ($NumCommits -le 0) { break }
    }

    $PrevHour = 0
    $PrevMin  = 0

    for ($i = 1; $i -le $NumCommits; $i++) {
        # Morning (9-11) or afternoon (14-17)
        $Cluster = Get-Random -Minimum 0 -Maximum 2
        if ($Cluster -eq 0) {
            $Hour = 9  + (Get-Random -Minimum 0 -Maximum 3)
            $Min  = Get-Random -Minimum 0 -Maximum 60
        } else {
            $Hour = 14 + (Get-Random -Minimum 0 -Maximum 4)
            $Min  = Get-Random -Minimum 0 -Maximum 60
        }

        # Space out multiple commits on the same day
        if ($i -gt 1) {
            $AddMin = 15 + (Get-Random -Minimum 0 -Maximum 31)
            $Min    = $PrevMin + $AddMin
            $Hour   = $PrevHour
            if ($Min -ge 60) {
                $Min  = $Min - 60
                $Hour = $Hour + 1
            }
        }

        $PrevHour = $Hour
        $PrevMin  = $Min

        $Sec       = Get-Random -Minimum 0 -Maximum 60
        $Timestamp = "{0:yyyy-MM-ddT}{1:D2}:{2:D2}:{3:D2}" -f $CurrentDate, $Hour, $Min, $Sec

        $env:GIT_AUTHOR_DATE    = $Timestamp
        $env:GIT_COMMITTER_DATE = $Timestamp

        $MsgBase   = $CommitTypes[(Get-Random -Minimum 0 -Maximum $CommitTypes.Count)]
        $Suffix    = $ContextSuffixes[(Get-Random -Minimum 0 -Maximum $ContextSuffixes.Count)]
        $Message   = "$MsgBase$Suffix"

        git commit --allow-empty -m $Message

        $TotalCommits++
    }

    $CurrentDate = $CurrentDate.AddDays(1)
}

# Clean up environment variables
Remove-Item Env:\GIT_AUTHOR_DATE    -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host "Successfully injected $TotalCommits realistic commits from $StartDate to $EndDate!" -ForegroundColor Green