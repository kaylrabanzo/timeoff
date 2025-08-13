CREATE VIEW active_leave_requests AS
SELECT * FROM leave_requests
WHERE deleted_at IS NULL;