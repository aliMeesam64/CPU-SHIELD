#!/bin/bash

# Configuration: March 15 to May 20, 2026
START_DATE="2026-03-15"
END_DATE="2026-05-20"

current_date="$START_DATE"

# Track total commits
TOTAL_COMMITS=0
MAX_COMMITS=40  # Upper limit

# Realistic commit patterns: Different types for different days
COMMIT_TYPES=(
    "Add some changes to project"
    "Resolve errors in code"
    "Update code"
    "Format code according to standards"
    "Optimize database queries"
    "Add unit tests for payment gateway"
    "Update dependencies"
    "Implement some more functionality"
    "resolve error"
    "Improve loading time for reports"
)

while [ "$current_date" != "$(date -d "$END_DATE + 1 day" +%Y-%m-%d 2>/dev/null || date -j -v+1d -f "%Y-%m-%d" "$END_DATE" +%Y-%m-%d)" ]; do
    # Get day of week (1=Monday, 7=Sunday)
    DAY_OF_WEEK=$(date -d "$current_date" +%u 2>/dev/null || date -j -f "%Y-%m-%d" "$current_date" +%u)
    
    # Realistic commit patterns:
    # - Weekdays (Mon-Fri): 0-2 commits
    # - Weekends (Sat-Sun): 0-1 commits (rarely)
    
    if [ $DAY_OF_WEEK -ge 6 ]; then
        # Weekend: 30% chance of 1 commit, 70% chance of 0
        if [ $((RANDOM % 100)) -lt 30 ]; then
            NUM_COMMITS=1
        else
            NUM_COMMITS=0
        fi
    else
        # Weekday: Weighted distribution
        RAND_VAL=$((RANDOM % 100))
        if [ $RAND_VAL -lt 20 ]; then
            NUM_COMMITS=0  # 20% no commits
        elif [ $RAND_VAL -lt 60 ]; then
            NUM_COMMITS=1  # 40% one commit
        elif [ $RAND_VAL -lt 85 ]; then
            NUM_COMMITS=2  # 25% two commits
        else
            NUM_COMMITS=3  # 15% three commits (rare)
        fi
    fi
    
    # Stop if we'll exceed max commits
    if [ $((TOTAL_COMMITS + NUM_COMMITS)) -gt $MAX_COMMITS ]; then
        NUM_COMMITS=$((MAX_COMMITS - TOTAL_COMMITS))
        if [ $NUM_COMMITS -le 0 ]; then
            break
        fi
    fi
    
    for ((i=1; i<=NUM_COMMITS; i++)); do
        # Realistic work hours: 9 AM - 6 PM, but clustered
        # Morning cluster (9-11:30) or afternoon cluster (14-17:30)
        CLUSTER=$((RANDOM % 2))
        if [ $CLUSTER -eq 0 ]; then
            # Morning hours
            HOUR=$(printf "%02d" $((9 + RANDOM % 3)))
            MIN=$(printf "%02d" $((RANDOM % 60)))
        else
            # Afternoon hours (with lunch break considered)
            HOUR=$(printf "%02d" $((14 + RANDOM % 4)))
            MIN=$(printf "%02d" $((RANDOM % 60)))
        fi
        
        SEC=$(printf "%02d" $((RANDOM % 60)))
        
        # Add small time gaps between commits on same day (minutes apart)
        if [ $i -gt 1 ]; then
            # Previous time + 15-45 minutes
            PREV_HOUR=$HOUR
            PREV_MIN=$MIN
            ADD_MIN=$((15 + RANDOM % 31))
            MIN=$((MIN + ADD_MIN))
            if [ $MIN -ge 60 ]; then
                MIN=$((MIN - 60))
                HOUR=$((HOUR + 1))
            fi
        fi
        
        FULL_TIMESTAMP="${current_date}T${HOUR}:${MIN}:${SEC}"
        
        # Override environment variables
        export GIT_AUTHOR_DATE="$FULL_TIMESTAMP"
        export GIT_COMMITTER_DATE="$FULL_TIMESTAMP"
        
        # Rotate through realistic commit messages
        COMMIT_INDEX=$((RANDOM % ${#COMMIT_TYPES[@]}))
        BASE_MESSAGE="${COMMIT_TYPES[$COMMIT_INDEX]}"
        
        # Add contextual details for realism
        CONTEXT_SUFFIXES=(
            ""  # Sometimes just the base message
            " (#${RANDOM:0:3})"  # Issue number
            " (fixes bug in production)"  # Bug fix context
            " (code review feedback)"  # Review context
        )
        SUFFIX_INDEX=$((RANDOM % ${#CONTEXT_SUFFIXES[@]}))
        
        git commit --allow-empty -m "${BASE_MESSAGE}${CONTEXT_SUFFIXES[$SUFFIX_INDEX]}"
        
        TOTAL_COMMITS=$((TOTAL_COMMITS + 1))
    done
    
    # Advance to next day
    current_date=$(date -d "$current_date + 1 day" +%Y-%m-%d 2>/dev/null || date -j -v+1d -f "%Y-%m-%d" "$current_date" +%Y-%m-%d)
done

# Clean up
unset GIT_AUTHOR_DATE
unset GIT_COMMITTER_DATE

echo "Successfully injected $TOTAL_COMMITS realistic commits from $START_DATE to $END_DATE!"